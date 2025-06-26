package pe.edu.vallegrande.remuneracion.application.service;

import pe.edu.vallegrande.remuneracion.domain.model.Salary;
import pe.edu.vallegrande.remuneracion.infrastructure.exception.ResourceNotFoundException;
import pe.edu.vallegrande.remuneracion.infrastructure.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;

    @Autowired
    public SalaryService(SalaryRepository salaryRepository) {
        this.salaryRepository = salaryRepository;
    }

    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    public Optional<Salary> getSalaryById(String id) {
        return salaryRepository.findById(id);
    }

    public Salary createSalary(Salary salary) {
        salary.setActive(true);
        return salaryRepository.save(salary);
    }

    public Salary updateSalary(String id, Salary salaryDetails) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary not found with id: " + id));

        salary.setWorkerId(salaryDetails.getWorkerId());
        salary.setChargeId(salaryDetails.getChargeId());
        salary.setBaseSalary(salaryDetails.getBaseSalary());
        salary.setBonus(salaryDetails.getBonus());
        salary.setDeductions(salaryDetails.getDeductions());
        salary.setNetSalary(salaryDetails.getNetSalary());
        salary.setEffectiveDate(salaryDetails.getEffectiveDate());
        salary.setActive(salaryDetails.getActive());

        return salaryRepository.save(salary);
    }

    public Salary softDeleteSalary(String id) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary not found with id: " + id));
        salary.setActive(false);
        return salaryRepository.save(salary);
    }

    public Salary restoreSalary(String id) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary not found with id: " + id));
        salary.setActive(true);
        return salaryRepository.save(salary);
    }
}