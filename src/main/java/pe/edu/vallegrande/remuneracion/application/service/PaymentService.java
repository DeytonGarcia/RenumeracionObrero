package pe.edu.vallegrande.remuneracion.application.service;

import pe.edu.vallegrande.remuneracion.domain.model.Payment;
import pe.edu.vallegrande.remuneracion.infrastructure.exception.ResourceNotFoundException;
import pe.edu.vallegrande.remuneracion.infrastructure.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(String id) {
        return paymentRepository.findById(id);
    }

    public Payment createPayment(Payment payment) {
        payment.setActive(true);
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String id, Payment paymentDetails) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        payment.setWorkerId(paymentDetails.getWorkerId());
        payment.setPaymentDate(paymentDetails.getPaymentDate());
        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentType(paymentDetails.getPaymentType());
        payment.setDescription(paymentDetails.getDescription());
        payment.setPeriodStart(paymentDetails.getPeriodStart());
        payment.setPeriodEnd(paymentDetails.getPeriodEnd());
        payment.setStatus(paymentDetails.getStatus());
        payment.setActive(paymentDetails.getActive());

        return paymentRepository.save(payment);
    }

    public Payment softDeletePayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        payment.setActive(false);
        return paymentRepository.save(payment);
    }

    public Payment restorePayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        payment.setActive(true);
        return paymentRepository.save(payment);
    }
}