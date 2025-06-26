package pe.edu.vallegrande.remuneracion.infrastructure.rest;

import pe.edu.vallegrande.remuneracion.application.service.PaymentService;
import pe.edu.vallegrande.remuneracion.domain.model.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentRestController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentRestController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String id) {
        return paymentService.getPaymentById(id)
                .map(payment -> new ResponseEntity<>(payment, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment createdPayment = paymentService.createPayment(payment);
        return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable String id, @RequestBody Payment paymentDetails) {
        Payment updatedPayment = paymentService.updatePayment(id, paymentDetails);
        return new ResponseEntity<>(updatedPayment, HttpStatus.OK);
    }

    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Payment> softDeletePayment(@PathVariable String id) {
        Payment deletedPayment = paymentService.softDeletePayment(id);
        return new ResponseEntity<>(deletedPayment, HttpStatus.OK);
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Payment> restorePayment(@PathVariable String id) {
        Payment restoredPayment = paymentService.restorePayment(id);
        return new ResponseEntity<>(restoredPayment, HttpStatus.OK);
    }
}