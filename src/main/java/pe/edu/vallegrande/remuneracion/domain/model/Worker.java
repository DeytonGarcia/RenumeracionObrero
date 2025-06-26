package pe.edu.vallegrande.remuneracion.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Data
@Document(collection = "workers")
public class Worker {
    @Id
    private String id;
    @Field("first_name")
    private String firstName;
    @Field("last_name")
    private String lastName;
    @Field("dni")
    private String dni;
    @Field("address")
    private String address;
    @Field("phone")
    private String phone;
    @Field("email")
    private String email;
    @Field("hire_date")
    private LocalDate hireDate;
    @Field("birth_date")
    private LocalDate birthDate;
    @Field("position")
    private String position;
    @Field("status")
    private String status;
    @Field("active")
    private Boolean active; // Campo para eliminación lógica
    @Field("created_at")
    private LocalDate createdAt;
    @Field("updated_at")
    private LocalDate updatedAt;
}