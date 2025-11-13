package appweb.T4.repo;

import appweb.T4.model.Nota;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double findAverageByAvisoId(@Param("avisoId") Integer avisoId);

    // derivada correcta para contar notas de un aviso
    long countByAviso_Id(Integer avisoId);
}

