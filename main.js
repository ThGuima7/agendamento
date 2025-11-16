const form = document.querySelector(".form");
const inputDate = document.querySelector("#date");
const inputClient = document.querySelector("#client");
const hoursList = document.querySelector("#hours");
const morningList = document.querySelector("#period-morning");
const afternoonList = document.querySelector("#period-afternoon");
const nightList = document.querySelector("#period-night");


// Qual horário escolhido //

let selectedHour = null;

// Carregar e Salvar Agendamentos //

let scheduleDB = JSON.parse(localStorage.getItem("scheduleDB")) || {};


// Salvar // 

function saveDB() {
  localStorage.setItem("scheduleDB", JSON.stringify(scheduleDB));
}

// Selecionar Horários - Impedir de Selecionar horas disponíveis - Salva o hoirário - //

hoursList.addEventListener("click", function (event) {
  const element = event.target;

  if (!element.classList.contains("hour-available")) return;

  document.querySelectorAll(".hour-available").forEach(h => {
    h.classList.remove("selected");
  });

  element.classList.add("selected");
  selectedHour = element.getAttribute("value");
});

// Mudança de Estado // 

inputDate.addEventListener("change", function () {
  renderScheduleForDate(inputDate.value);
});

// Inserir Informações do Clientee //

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = inputDate.value;
  const client = inputClient.value.trim();

  if (!date) {
    alert("Seleciona a Data");
    return;
  }

  if (!selectedHour) {
    alert("Selecione o Horario");
    return;
  }

  if (!client) {
    alert("Nome do Cliente:");
    return;
  }

  if (!scheduleDB[date]) {
    scheduleDB[date] = [];
  }

  const alreadyExists = scheduleDB[date].some(
    item => item.hour === selectedHour
  );

  if (alreadyExists) {
    alert("Horário já agendado. ");
    return;
  }

  scheduleDB[date].push({
    hour: selectedHour,
    client: client
  });

  saveDB();
  renderScheduleForDate(date);

  alert("Agendamento concluído");
  inputClient.value = "";
  selectedHour = null;
  document.querySelectorAll(".hour-available").forEach(h => {
    h.classList.remove("selected");
  });
});

// Funções de Limpeza e Exibição // 

function renderScheduleForDate(date) {
  morningList.innerHTML = "";
  afternoonList.innerHTML = "";
  nightList.innerHTML = "";

  if (!scheduleDB[date]) return;

  scheduleDB[date].forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.hour}</strong>
      <span>${item.client}</span>
      <img src="./src/assets/cancel.svg" class="cancel-icon">
    `;

    li.querySelector(".cancel-icon").addEventListener("click", () => {
      removeAppointment(date, item.hour);
    });

    const hourNum = parseInt(item.hour.split(":")[0]);

    if (hourNum >= 9 && hourNum <= 12) morningList.appendChild(li);
    else if (hourNum >= 13 && hourNum <= 18) afternoonList.appendChild(li);
    else nightList.appendChild(li);
  });
}

// Remover Agendamento // 

function removeAppointment(date, hour) {
  scheduleDB[date] = scheduleDB[date].filter(
    item => item.hour !== hour
  );

  saveDB();
  renderScheduleForDate(date);
}
