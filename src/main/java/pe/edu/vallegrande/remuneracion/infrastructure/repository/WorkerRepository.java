package pe.edu.vallegrande.remuneracion.infrastructure.repository;

import pe.edu.vallegrande.remuneracion.domain.model.Worker;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkerRepository extends MongoRepository<Worker, String> {
}