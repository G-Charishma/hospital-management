package com.hospital.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {

    @Autowired
    private PatientRepository repo;

    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return repo.save(patient);
    }

    @GetMapping
    public List<Patient> getPatients() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Patient not found"));
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id,
                                 @RequestBody Patient patient) {
        Patient old = getPatient(id);

        old.setName(patient.getName());
        old.setAge(patient.getAge());
        old.setGender(patient.getGender());
        old.setPhone(patient.getPhone());
        old.setEmail(patient.getEmail());

        return repo.save(old);
    }

    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        repo.delete(getPatient(id));
        return "Patient deleted successfully";
    }
}