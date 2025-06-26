package pe.edu.vallegrande.remuneracion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "pe.edu.vallegrande.remuneracion.infrastructure.repository")
public class RemuneracionApplication {

	public static void main(String[] args) {
		SpringApplication.run(RemuneracionApplication.class, args);
	}

}