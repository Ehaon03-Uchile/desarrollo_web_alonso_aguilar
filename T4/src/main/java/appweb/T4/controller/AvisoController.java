package appweb.T4.controller;

import appweb.T4.dto.*;
import appweb.T4.model.*;
import appweb.T4.repo.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/avisos")
@CrossOrigin(origins = "*") // puedes restringir en producción
public class AvisoController {

    private final AvisoRepository avisoRepository;
    private final NotaRepository notaRepository;

    public AvisoController(AvisoRepository avisoRepository, NotaRepository notaRepository) {
        this.avisoRepository = avisoRepository;
        this.notaRepository = notaRepository;
    }

    /**
     * 1) Listado de avisos: ID, fecha, sector, cantidad, tipo, edad, unidad, comuna, promedio y contador
     */
    @GetMapping
    public List<AvisoDTO> listarAvisos() {
        List<AvisoAdopcion> avisos = avisoRepository.findAll();
        return avisos.stream().map(a -> {
            Double avg = notaRepository.findAverageByAvisoId(a.getId());
            Long cnt = notaRepository.countByAviso_Id(a.getId());
            Double rounded = (avg != null) ? Math.round(avg * 100.0) / 100.0 : null;
            return new AvisoDTO(
                    a.getId(),
                    a.getFechaIngreso(),
                    a.getSector(),
                    a.getCantidad(),
                    a.getTipo(),
                    a.getEdad(),
                    a.getUnidadMedida(),
                    a.getComuna() != null ? a.getComuna().getNombre() : null,
                    rounded,
                    cnt
            );
        }).collect(Collectors.toList());
    }

    /**
     * 2) Agregar nota (validada 1..7). Devuelve promedio y contador actualizados.
     */
    @PostMapping("/{id}/nota")
    public ResponseEntity<?> agregarNota(
            @PathVariable("id") Integer avisoId,
            @Valid @RequestBody NotaRequest request) {

        Optional<AvisoAdopcion> avisoOpt = avisoRepository.findById(avisoId);
        if (avisoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        int n = request.nota;
        if (n < 1 || n > 7) {
            return ResponseEntity.badRequest().body("Nota debe estar entre 1 y 7");
        }

        Nota nueva = new Nota();
        nueva.setNota(n);
        nueva.setAviso(avisoOpt.get());
        notaRepository.save(nueva);

        Double avg = notaRepository.findAverageByAvisoId(avisoId);
        Long cnt = notaRepository.countByAviso_Id(avisoId);
        Double rounded = (avg != null) ? Math.round(avg * 100.0) / 100.0 : null;

        return ResponseEntity.ok(new NotaResultDTO(rounded, cnt));
    }
}
