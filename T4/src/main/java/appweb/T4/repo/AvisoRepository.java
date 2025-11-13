package appweb.T4.repo;

import appweb.T4.model.AvisoAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvisoRepository extends JpaRepository<AvisoAdopcion, Integer> {
    // si en el futuro quieres búsquedas por tipo/comuna, agrégalas aquí
}
