import { useEffect, useState } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    event: "Tech Innovators Meetup",
  });

  const [message, setMessage] = useState("");
  const [registrations, setRegistrations] = useState([]);

  const events = [
    {
      title: "Tech Innovators Meetup",
      date: "18 October 2026",
      location: "Seminar Hall",
      description:
        "Explore emerging technologies and innovative ideas with fellow students.",
    },
    {
      title: "CodeSprint Hackathon",
      date: "22 October 2026",
      location: "Computer Lab",
      description:
        "Build, compete and solve real-world problems in an exciting coding challenge.",
    },
    {
      title: "Campus Cultural Fest",
      date: "25 October 2026",
      location: "College Auditorium",
      description:
        "Celebrate creativity, music, art and culture with the college community.",
    },
  ];

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(
        "https://campusevents-sz8q.onrender.com/api/registrations"
      );

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Unable to fetch registrations:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://campusevents-sz8q.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Registration successful! ${form.name} is registered for ${form.event}.`
        );

        setForm({
          name: "",
          email: "",
          event: "Tech Innovators Meetup",
        });

        // Refresh the registration list
        fetchRegistrations();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  return (
    <div>
      <nav>
        <div className="logo">
          Campus<span>Events</span>
        </div>

        <div className="nav-links">
          <a href="#events">Events</a>
          <a href="#register">Register</a>
          <a href="#registrations">Registrations</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">YOUR CAMPUS. YOUR COMMUNITY.</p>

          <h1>
            Discover what's
            <br />
            happening on campus.
          </h1>

          <p className="hero-text">
            Find exciting events, connect with students and
            make your college experience more memorable.
          </p>

          <a href="#events" className="hero-button">
            Explore Events
          </a>
        </div>
      </section>

      <section id="events" className="events-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UPCOMING</p>
            <h2>Campus Events</h2>
          </div>

          <p>
            Something interesting is always happening
            around campus.
          </p>
        </div>

        <div className="event-grid">
          {events.map((event, index) => (
            <div className="event-card" key={index}>
              <div className="event-number">
                0{index + 1}
              </div>

              <h3>{event.title}</h3>

              <p className="event-description">
                {event.description}
              </p>

              <div className="event-info">
                <span>{event.date}</span>
                <span>{event.location}</span>
              </div>

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    event: event.title,
                  })
                }
              >
                Select Event →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="register" className="register-section">
        <div className="register-info">
          <p className="eyebrow">JOIN US</p>

          <h2>Reserve your spot.</h2>

          <p>
            Fill in your details and register for your
            favourite campus event.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />

          <label>Select Event</label>

          <select
            value={form.event}
            onChange={(e) =>
              setForm({
                ...form,
                event: e.target.value,
              })
            }
          >
            {events.map((event) => (
              <option key={event.title}>
                {event.title}
              </option>
            ))}
          </select>

          <button type="submit">
            Complete Registration
          </button>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}
        </form>
      </section>

      {/* Registrations Section */}
      <section
        id="registrations"
        className="registrations-section"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">REGISTERED</p>
            <h2>Registered Students</h2>
          </div>

          <p>
            Students who have registered for upcoming
            campus events.
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className="no-registrations">
            No registrations yet.
          </div>
        ) : (
          <div className="registrations-table-wrapper">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Registered On</th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id}>
                    <td>{registration.name}</td>
                    <td>{registration.event}</td>
                    <td>
                      {new Date(
                        registration.registeredAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        <strong>CampusEvents</strong>
        <span>College Event Registration Portal</span>
      </footer>
    </div>
  );
}

export default App;
