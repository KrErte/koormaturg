package ee.koormaturg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KoormaturgApplication {
    public static void main(String[] args) {
        SpringApplication.run(KoormaturgApplication.class, args);
    }
}
