package pe.edu.vallegrande.remuneracion.infrastructure.rest;

import pe.edu.vallegrande.remuneracion.application.service.ChargeService;
import pe.edu.vallegrande.remuneracion.domain.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charges")
public class ChargeRestController {

    private final ChargeService chargeService;

    @Autowired
    public ChargeRestController(ChargeService chargeService) {
        this.chargeService = chargeService;
    }

    @GetMapping
    public ResponseEntity<List<Charge>> getAllCharges() {
        List<Charge> charges = chargeService.getAllCharges();
        return new ResponseEntity<>(charges, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Charge> getChargeById(@PathVariable String id) {
        return chargeService.getChargeById(id)
                .map(charge -> new ResponseEntity<>(charge, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Charge> createCharge(@RequestBody Charge charge) {
        Charge createdCharge = chargeService.createCharge(charge);
        return new ResponseEntity<>(createdCharge, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Charge> updateCharge(@PathVariable String id, @RequestBody Charge chargeDetails) {
        Charge updatedCharge = chargeService.updateCharge(id, chargeDetails);
        return new ResponseEntity<>(updatedCharge, HttpStatus.OK);
    }

    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Charge> softDeleteCharge(@PathVariable String id) {
        Charge deletedCharge = chargeService.softDeleteCharge(id);
        return new ResponseEntity<>(deletedCharge, HttpStatus.OK);
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Charge> restoreCharge(@PathVariable String id) {
        Charge restoredCharge = chargeService.restoreCharge(id);
        return new ResponseEntity<>(restoredCharge, HttpStatus.OK);
    }
}