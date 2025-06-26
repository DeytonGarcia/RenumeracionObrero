package pe.edu.vallegrande.remuneracion.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = "charges")
public class Charge {
    @Id
    private String id;
    @Field("name")
    private String name;
    @Field("description")
    private String description;
    @Field("base_salary_min")
    private Double baseSalaryMin;
    @Field("base_salary_max")
    private Double baseSalaryMax;
    @Field("responsibilities")
    private List<String> responsibilities;
    @Field("required_skills")
    private List<String> requiredSkills;
    @Field("benefits")
    private List<String> benefits;
    @Field("active")
    private Boolean active; // Campo para eliminación lógica
}