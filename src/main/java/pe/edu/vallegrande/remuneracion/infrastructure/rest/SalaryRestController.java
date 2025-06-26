package pe.edu.vallegrande.remuneracion.infrastructure.rest;

import pe.edu.vallegrande.remuneracion.application.service.SalaryService;
import pe.edu.vallegrande.remuneracion.domain.model.Salary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryRestController {

    private final SalaryService salaryService;

    @Autowired
    public SalaryRestController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping
    public ResponseEntity<List<Salary>> getAllSalaries() {
        List<Salary> salaries = salaryService.getAllSalaries();
        return new ResponseEntity<>(salaries, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salary> getSalaryById(@PathVariable String id) {
        return salaryService.getSalaryById(id)
                .map(salary -> new ResponseEntity<>(salary, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Salary> createSalary(@RequestBody Salary salary) {
        Salary createdSalary = salaryService.createSalary(salary);
        return new ResponseEntity<>(createdSalary, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Salary> updateSalary(@PathVariable String id, @RequestBody Salary salaryDetails) {
        Salary updatedSalary = salaryService.updateSalary(id, salaryDetails);
        return new ResponseEntity<>(updatedSalary, HttpStatus.OK);
    }

    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Salary> softDeleteSalary(@PathVariable String id) {
        Salary deletedSalary = salaryService.softDeleteSalary(id);
        return new ResponseEntity<>(deletedSalary, HttpStatus.OK);
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Salary> restoreSalary(@PathVariable String id) {
        Salary restoredSalary = salaryService.restoreSalary(id);
        return new ResponseEntity<>(restoredSalary, HttpStatus.OK);
    }
}