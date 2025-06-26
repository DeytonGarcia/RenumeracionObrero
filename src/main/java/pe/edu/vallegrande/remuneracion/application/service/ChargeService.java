package pe.edu.vallegrande.remuneracion.application.service;

import pe.edu.vallegrande.remuneracion.domain.model.Charge;
import pe.edu.vallegrande.remuneracion.infrastructure.exception.ResourceNotFoundException;
import pe.edu.vallegrande.remuneracion.infrastructure.repository.ChargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChargeService {

    private final ChargeRepository chargeRepository;

    @Autowired
    public ChargeService(ChargeRepository chargeRepository) {
        this.chargeRepository = chargeRepository;
    }

    public List<Charge> getAllCharges() {
        return chargeRepository.findAll();
    }

    public Optional<Charge> getChargeById(String id) {
        return chargeRepository.findById(id);
    }

    public Charge createCharge(Charge charge) {
        charge.setActive(true);
        return chargeRepository.save(charge);
    }

    public Charge updateCharge(String id, Charge chargeDetails) {
        Charge charge = chargeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Charge not found with id: " + id));

        charge.setName(chargeDetails.getName());
        charge.setDescription(chargeDetails.getDescription());
        charge.setBaseSalaryMin(chargeDetails.getBaseSalaryMin());
        charge.setBaseSalaryMax(chargeDetails.getBaseSalaryMax());
        charge.setResponsibilities(chargeDetails.getResponsibilities());
        charge.setRequiredSkills(chargeDetails.getRequiredSkills());
        charge.setBenefits(chargeDetails.getBenefits());
        charge.setActive(chargeDetails.getActive());

        return chargeRepository.save(charge);
    }

    public Charge softDeleteCharge(String id) {
        Charge charge = chargeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Charge not found with id: " + id));
        charge.setActive(false);
        return chargeRepository.save(charge);
    }

    public Charge restoreCharge(String id) {
        Charge charge = chargeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Charge not found with id: " + id));
        charge.setActive(true);
        return chargeRepository.save(charge);
    }
}