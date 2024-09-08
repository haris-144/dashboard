import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";

// Quote API URL
const QUOTE_API_URL = "https://api.quotable.io/random";

function Dashboard() {
  return (
    <Container>
      {/* First Row: Quote Card */}
      <Row className={"mb-4"}>
        <Col xs={12}>
          <WithHeaderAndQuoteExample />
        </Col>
      </Row>

      {/* Second Row: Digital Clock and Calendar */}
      <Row className={"mb-4"}>
        <Col md={8}>
          <DigitalClock />
        </Col>
        <Col md={4}>
          <CalendarWidget />
        </Col>
      </Row>

      {/* Third Row: Currency Converter and Task List */}
      <Row>
        <Col md={6}>
          <CurrencyConverter />
        </Col>
        <Col md={6}>
          <TaskListWidget />
        </Col>
      </Row>
    </Container>
  );
}

function WithHeaderAndQuoteExample() {
  const [quote, setQuote] = useState({ content: "", author: "" });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(QUOTE_API_URL);
        const data = await response.json();
        setQuote({ content: data.content, author: data.author });
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    fetchQuote();
  }, []);

  return (
    <Card>
      <Card.Body>
        <blockquote className="blockquote text-center mb-0">
          <p>{quote.content}</p>
          <footer className="blockquote-footer">{quote.author}</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

function TaskListWidget() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (tasks.length < 3 && newTask.trim()) {
      const updatedTasks = [...tasks, { text: newTask, completed: false }];
      setTasks(updatedTasks);
      setNewTask("");
    } else if (tasks.length >= 3) {
      alert("You cannot add more than 3 tasks.");
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Card
      className="mb-4"
      style={{
        width: "100%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "none",
      }}
    >
      <Card.Header className={"background-dashboard"}>
        <h6 className={"bg-text"}>Task List</h6>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <div className="row">
              <div className="col-md-8">
                <Form.Control
                  type="text"
                  placeholder="Add a new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <Button onClick={addTask} variant="success" className="ms-2">
                  +
                </Button>
              </div>
            </div>
          </Form.Group>
          <ListGroup>
            {tasks.map((task, index) => (
              <ListGroup.Item
                key={index}
                variant={task.completed ? "success" : "light"}
                className="d-flex justify-content-between align-items-center"
              >
                <span
                  onClick={() => toggleTask(index)}
                  style={{
                    cursor: "pointer",
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.text}
                </span>
                <Button
                  onClick={() => removeTask(index)}
                  variant="danger"
                  size="sm"
                >
                  ×
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const convertCurrency = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      } catch (error) {
        console.error("Error converting currency:", error);
        setConvertedAmount(null);
      }
    };

    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <Card
      className="mb-4"
      style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "none" }}
    >
      <Card.Header className={"background-dashboard"}>
        <h6 className={"bg-text"}>Currency Converter</h6>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between">
              <Form.Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={{ flex: 1, marginRight: "5px" }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="PKR">PKR</option>
              </Form.Select>
              <Form.Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={{ flex: 1, marginLeft: "5px" }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="PKR">PKR</option>
              </Form.Select>
            </div>
          </Form.Group>
          <div style={{ textAlign: "center", fontWeight: "bolder" }}>
            {convertedAmount !== null &&
              `Converted Amount: ${convertedAmount} ${toCurrency}`}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourDegrees = ((hours % 12) * 30 + minutes * 0.5).toFixed(1);
  const minuteDegrees = (minutes * 6).toFixed(1);
  const secondDegrees = (seconds * 6).toFixed(1);

  const generateDots = () => {
    const dots = [];
    const radius = 75;
    const centerX = 80;
    const centerY = 80;

    for (let i = 0; i < 60; i++) {
      const angle = i * 6;
      const radian = (angle - 90) * (Math.PI / 180);
      const size = i % 5 === 0 ? 4 : 2;
      const x = Math.cos(radian) * radius + centerX;
      const y = Math.sin(radian) * radius + centerY;
      const dotStyle = {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "black",
        borderRadius: "50%",
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
      };
      dots.push(<div key={i} style={dotStyle} />);
    }

    return dots;
  };

  const clockContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "20px",
  };

  const outerBorderStyle = {
    position: "relative",
    width: "160px",
    height: "160px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handStyle = {
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "bottom",
    borderRadius: "2px",
  };

  const hourHandStyle = {
    ...handStyle,
    height: "30%",
    width: "4px",
    backgroundColor: "#333",
    transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
  };

  const minuteHandStyle = {
    ...handStyle,
    height: "40%",
    width: "3px",
    backgroundColor: "#333",
    transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
  };

  const secondHandStyle = {
    ...handStyle,
    height: "45%",
    width: "1px",
    backgroundColor: "red",
    transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
  };

  const centerDotStyle = {
    position: "absolute",
    width: "12px",
    height: "12px",
    backgroundColor: "#333",
    borderRadius: "50%",
    zIndex: 10,
  };

  const digitalTimeStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    margin: "auto 0",
  };

  return (
    <Card
      className="mb-4"
      style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "none" }}
    >
      <Card.Header className={"background-dashboard"}>
        <h6 className={"bg-text"}>Clock</h6>
      </Card.Header>
      <Card.Body>
        <div style={clockContainerStyle}>
          <div style={outerBorderStyle}>
            {generateDots()}
            <div style={hourHandStyle}></div>
            <div style={minuteHandStyle}></div>
            <div style={secondHandStyle}></div>
            <div style={centerDotStyle}></div>
          </div>
          <div style={digitalTimeStyle}>
            <h3>{currentTime.toLocaleTimeString()}</h3>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateCalendar = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays = [];
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const isCurrentDate =
        isCurrentMonth &&
        dayNumber === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      calendarDays.push(
        <div
          key={i}
          className={`p-2 text-center ${
            isCurrentMonth ? "" : "text-muted"
          } ${isCurrentDate ? "bg-primary text-white" : ""}`}
          style={{
            flexBasis: "calc(100% / 7)",
            maxWidth: "calc(100% / 7)",
            height: "40px",
            lineHeight: "40px",
          }}
        >
          {isCurrentMonth ? dayNumber : ""}
        </div>
      );
    }

    return calendarDays;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Card
      className="mb-4"
      style={{
        width: "100%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "none",
      }}
    >
      <Card.Header className={"background-dashboard"}>
        <h6 className={"bg-text"}>Calendar</h6>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Button variant="link" onClick={handlePrevMonth}>
            &lt;
          </Button>
          <h5 className="mb-0">
            {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h5>
          <Button variant="link" onClick={handleNextMonth}>
            &gt;
          </Button>
        </div>
        <div className="d-flex flex-wrap">
          {/* Render Days of the Week */}
          <div className="w-100 d-flex">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-weight-bold"
                style={{
                  flexBasis: "calc(100% / 7)",
                  maxWidth: "calc(100% / 7)",
                  height: "40px",
                  lineHeight: "40px",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Render Calendar Days */}
          {generateCalendar()}
        </div>
      </Card.Body>
    </Card>
  );
}

export default Dashboard;
