package appweb.T4.dto;

public class NotaResultDTO {
    public Double promedio;
    public Long contador;

    public NotaResultDTO() {}
    public NotaResultDTO(Double promedio, Long contador) {
        this.promedio = promedio;
        this.contador = contador;
    }
}
