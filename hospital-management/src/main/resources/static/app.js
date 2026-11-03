
const API = "/api";

async function request(url, options = {}) {
    const response = await fetch(API + url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    if (response.status === 204) return null;

    return response.json();
}

function showMessage(message, success = true) {
    document.getElementById("message").innerHTML =
        `<div class="alert ${success ? "alert-success" : "alert-danger"}">${message}</div>`;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Load Patients
async function loadPatients() {
    const patients = await request("/patients");

    document.getElementById("patientCount").textContent = patients.length;

    document.getElementById("patientTable").innerHTML =
        patients.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${escapeHTML(p.name)}</td>
            <td>${p.age}</td>
            <td>${escapeHTML(p.gender)}</td>
            <td>${escapeHTML(p.phone)}</td>
            <td>${escapeHTML(p.email)}</td>
        </tr>
    `).join("");

    document.getElementById("patientId").innerHTML =
        '<option value="">Select Patient</option>' +
        patients.map(p =>
            `<option value="${p.id}">${escapeHTML(p.name)} (ID: ${p.id})</option>`
        ).join("");
}

// Load Doctors
async function loadDoctors() {
    const doctors = await request("/doctors");

    document.getElementById("doctorCount").textContent = doctors.length;

    document.getElementById("doctorTable").innerHTML =
        doctors.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${escapeHTML(d.name)}</td>
            <td>${escapeHTML(d.specialization)}</td>
            <td>${escapeHTML(d.phone)}</td>
            <td>${d.consultationFee}</td>
        </tr>
    `).join("");

    document.getElementById("doctorId").innerHTML =
        '<option value="">Select Doctor</option>' +
        doctors.map(d =>
            `<option value="${d.id}">${escapeHTML(d.name)} (ID: ${d.id})</option>`
        ).join("");
}

// Load Appointments
async function loadAppointments() {
    const appointments = await request("/appointments");

    document.getElementById("appointmentCount").textContent =
        appointments.length;

    document.getElementById("appointmentTable").innerHTML =
        appointments.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${escapeHTML(a.patient?.name)}</td>
            <td>${escapeHTML(a.doctor?.name)}</td>
            <td>${escapeHTML(a.appointmentDate)}</td>
            <td>${escapeHTML(a.status)}</td>
            <td>
                ${a.status === "BOOKED" ?
                    `<button class="btn btn-danger btn-sm"
                     onclick="cancelAppointment(${a.id})">Cancel</button>`
                    : "—"}
            </td>
        </tr>
    `).join("");
}

// Register Patient
document.getElementById("patientForm").addEventListener("submit",
    async function(event) {
        event.preventDefault();

        try {
            await request("/patients", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById("pname").value,
                    age: Number(document.getElementById("age").value),
                    gender: document.getElementById("gender").value,
                    phone: document.getElementById("phone").value,
                    email: document.getElementById("email").value
                })
            });

            showMessage("Patient registered successfully!");
            this.reset();
            await loadPatients();
        } catch (error) {
            showMessage(error.message, false);
        }
    }
);

// Register Doctor
document.getElementById("doctorForm").addEventListener("submit",
    async function(event) {
        event.preventDefault();

        try {
            await request("/doctors", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById("dname").value,
                    specialization: document.getElementById("specialization").value,
                    phone: document.getElementById("dphone").value,
                    consultationFee: Number(document.getElementById("fee").value)
                })
            });

            showMessage("Doctor registered successfully!");
            this.reset();
            await loadDoctors();
        } catch (error) {
            showMessage(error.message, false);
        }
    }
);

// Book Appointment
document.getElementById("appointmentForm").addEventListener("submit",
    async function(event) {
        event.preventDefault();

        try {
            await request("/appointments", {
                method: "POST",
                body: JSON.stringify({
                    patientId: Number(document.getElementById("patientId").value),
                    doctorId: Number(document.getElementById("doctorId").value),
                    appointmentDate: document.getElementById("appointmentDate").value
                })
            });

            showMessage("Appointment booked successfully!");
            this.reset();
            await loadAppointments();
        } catch (error) {
            showMessage(error.message, false);
        }
    }
);

// Cancel Appointment
async function cancelAppointment(id) {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
        return;
    }

    try {
        await request(`/appointments/${id}/cancel`, {
            method: "PUT"
        });

        showMessage("Appointment cancelled successfully!");
        await loadAppointments();
    } catch (error) {
        showMessage(error.message, false);
    }
}

// Initial Loading
async function loadAllData() {
    try {
        await Promise.all([
            loadPatients(),
            loadDoctors(),
            loadAppointments()
        ]);
    } catch (error) {
        showMessage("Unable to load data: " + error.message, false);
    }
}

loadAllData();
