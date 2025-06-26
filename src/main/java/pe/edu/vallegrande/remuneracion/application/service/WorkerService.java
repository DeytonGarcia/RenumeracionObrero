package pe.edu.vallegrande.remuneracion.application.service;

import pe.edu.vallegrande.remuneracion.domain.model.Worker;
import pe.edu.vallegrande.remuneracion.infrastructure.exception.ResourceNotFoundException;
import pe.edu.vallegrande.remuneracion.infrastructure.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    @Autowired
    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public Optional<Worker> getWorkerById(String id) {
        return workerRepository.findById(id);
    }

    public Worker createWorker(Worker worker) {
        worker.setCreatedAt(LocalDate.now());
        worker.setUpdatedAt(LocalDate.now());
        worker.setActive(true);
        return workerRepository.save(worker);
    }

    public Worker updateWorker(String id, Worker workerDetails) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found with id: " + id));

        worker.setFirstName(workerDetails.getFirstName());
        worker.setLastName(workerDetails.getLastName());
        worker.setDni(workerDetails.getDni());
        worker.setAddress(workerDetails.getAddress());
        worker.setPhone(workerDetails.getPhone());
        worker.setEmail(workerDetails.getEmail());
        worker.setHireDate(workerDetails.getHireDate());
        worker.setBirthDate(workerDetails.getBirthDate());
        worker.setPosition(workerDetails.getPosition());
        worker.setStatus(workerDetails.getStatus());
        worker.setActive(workerDetails.getActive());
        worker.setUpdatedAt(LocalDate.now());

        return workerRepository.save(worker);
    }

    public Worker softDeleteWorker(String id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found with id: " + id));
        worker.setActive(false);
        worker.setUpdatedAt(LocalDate.now());
        return workerRepository.save(worker);
    }

    public Worker restoreWorker(String id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found with id: " + id));
        worker.setActive(true);
        worker.setUpdatedAt(LocalDate.now());
        return workerRepository.save(worker);
    }
}