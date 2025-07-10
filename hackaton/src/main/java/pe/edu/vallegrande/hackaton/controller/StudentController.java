package pe.edu.vallegrande.hackaton.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/api")
public class StudentController {

    @GetMapping("/student")
    public Map<String, String> getStudent() {
        Map<String, String> student = new HashMap<>();
        student.put("dni", "87654321");
        student.put("firstName", "deyton paolo");
        student.put("lastName", "garcia avalos");
        student.put("date", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return student;
    }
}