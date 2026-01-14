package appweb.T4.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class NotaRequest {
    @NotNull
    @Min(1)
    @Max(7)
    public Integer nota;

    public NotaRequest() {}
    public NotaRequest(Integer nota) { this.nota = nota; }
}
