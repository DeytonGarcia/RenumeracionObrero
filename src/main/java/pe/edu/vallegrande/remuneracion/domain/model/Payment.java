package pe.edu.vallegrande.remuneracion.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    @Field("worker_id")
    private String workerId;
    @Field("payment_date")
    private LocalDate paymentDate;
    @Field("amount")
    private Double amount;
    @Field("payment_type")
    private String paymentType;
    @Field("description")
    private String description;
    @Field("period_start")
    private LocalDate periodStart;
    @Field("period_end")
    private LocalDate periodEnd;
    @Field("status")
    private String status;
    @Field("active")
    private Boolean active;
}