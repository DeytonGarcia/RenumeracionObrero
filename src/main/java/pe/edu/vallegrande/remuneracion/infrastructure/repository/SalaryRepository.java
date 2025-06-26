package pe.edu.vallegrande.remuneracion.infrastructure.repository;

import pe.edu.vallegrande.remuneracion.domain.model.Salary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRepository extends MongoRepository<Salary, String> {
}