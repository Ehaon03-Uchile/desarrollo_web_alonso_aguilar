package appweb.T4.dto;

import java.time.LocalDateTime;

public class AvisoDTO {
    public Integer id;
    public LocalDateTime fechaPublicacion;
    public String sector;
    public Integer cantidad;
    public String tipo;
    public Integer edad;
    public String unidadMedida;
    public String comuna;
    public Double promedioNota; // null si no hay notas
    public Long contadorNotas;

    public AvisoDTO() {}

    public AvisoDTO(Integer id, LocalDateTime fechaPublicacion, String sector, Integer cantidad,
                    String tipo, Integer edad, String unidadMedida, String comuna,
                    Double promedioNota, Long contadorNotas) {
        this.id = id;
        this.fechaPublicacion = fechaPublicacion;
        this.sector = sector;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.edad = edad;
        this.unidadMedida = unidadMedida;
        this.comuna = comuna;
        this.promedioNota = promedioNota;
        this.contadorNotas = contadorNotas;
    }
}
