package com.hospital.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.hospital.entity.Doctor;
import com.hospital.repository.DoctorRepository;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin
public class DoctorController {

    @Autowired
    private DoctorRepository repo;

    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return repo.save(doctor);
    }

    @GetMapping
    public List<Doctor> getDoctors() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Doctor getDoctor(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Doctor not found"));
    }

    @GetMapping("/specialization/{name}")
    public List<Doctor> searchDoctor(@PathVariable String name) {
        return repo.findBySpecializationIgnoreCase(name);
    }

    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        repo.delete(getDoctor(id));
        return "Doctor deleted successfully";
    }
}