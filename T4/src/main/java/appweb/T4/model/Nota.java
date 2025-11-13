package appweb.T4.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nota", nullable = false)
    private Integer nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso;

    // getters / setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public AvisoAdopcion getAviso() { return aviso; }
    public void setAviso(AvisoAdopcion aviso) { this.aviso = aviso; }
}
