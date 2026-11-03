package com.hospital.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.hospital.entity.*;
import com.hospital.repository.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin
public class AppointmentController {

    @Autowired
    private AppointmentRepository repo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private DoctorRepository doctorRepo;

    public record BookingRequest(
        Long patientId,
        Long doctorId,
        LocalDateTime appointmentDate
    ) {}

    @PostMapping
    public Appointment bookAppointment(
            @RequestBody BookingRequest request) {

        Patient patient = patientRepo.findById(request.patientId())
                .orElseThrow(() ->
                    new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepo.findById(request.doctorId())
                .orElseThrow(() ->
                    new RuntimeException("Doctor not found"));

        if (request.appointmentDate() == null ||
                !request.appointmentDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Choose a future appointment date");
        }

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.appointmentDate());
        appointment.setStatus("BOOKED");

        return repo.save(appointment);
    }

    @GetMapping
    public List<Appointment> getAppointments() {
        return repo.findAll();
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointment(@PathVariable Long id) {

        Appointment appointment = repo.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Appointment not found"));

        appointment.setStatus("CANCELLED");

        return repo.save(appointment);
    }
}