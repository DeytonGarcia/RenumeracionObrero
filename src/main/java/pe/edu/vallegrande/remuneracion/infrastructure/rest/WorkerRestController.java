package pe.edu.vallegrande.remuneracion.infrastructure.rest;

import pe.edu.vallegrande.remuneracion.application.service.WorkerService;
import pe.edu.vallegrande.remuneracion.domain.model.Worker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "http://localhost:4200")
public class WorkerRestController {

    private final WorkerService workerService;

    @Autowired
    public WorkerRestController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        List<Worker> workers = workerService.getAllWorkers();
        return new ResponseEntity<>(workers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable String id) {
        return workerService.getWorkerById(id)
                .map(worker -> new ResponseEntity<>(worker, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Worker> createWorker(@RequestBody Worker worker) {
        Worker createdWorker = workerService.createWorker(worker);
        return new ResponseEntity<>(createdWorker, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable String id, @RequestBody Worker workerDetails) {
        Worker updatedWorker = workerService.updateWorker(id, workerDetails);
        return new ResponseEntity<>(updatedWorker, HttpStatus.OK);
    }

    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Worker> softDeleteWorker(@PathVariable String id) {
        Worker deletedWorker = workerService.softDeleteWorker(id);
        return new ResponseEntity<>(deletedWorker, HttpStatus.OK);
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Worker> restoreWorker(@PathVariable String id) {
        Worker restoredWorker = workerService.restoreWorker(id);
        return new ResponseEntity<>(restoredWorker, HttpStatus.OK);
    }
}