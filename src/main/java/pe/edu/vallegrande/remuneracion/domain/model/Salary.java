package pe.edu.vallegrande.remuneracion.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Data
@Document(collection = "salaries")
public class Salary {
    @Id
    private String id;
    @Field("worker_id")
    private String workerId;
    @Field("charge_id")
    private String chargeId;
    @Field("base_salary")
    private Double baseSalary;
    @Field("bonus")
    private Double bonus;
    @Field("deductions")
    private Double deductions;
    @Field("net_salary")
    private Double netSalary;
    @Field("effective_date")
    private LocalDate effectiveDate;
    @Field("active")
    private Boolean active; // Campo para eliminación lógica
}