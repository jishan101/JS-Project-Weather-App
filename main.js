const tempData = {
    country: "",
    city: "",
    apiKey: "b43a77f2f2ae028871b5328ad600fa46",

    async getApiData() {
        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.apiKey}`);
            const data = await response.json();

            if(data.cod >= 400) {
                UI.showMessage(data.message);
                localStorage.removeItem("local_store_country");
                localStorage.removeItem("local_store_city");
                return false;
            } else {
                return data;
            }
        } catch (err) {
            UI.showMessage("Some error occured!");
        }
    }
};

const localStore = {
    country: "",
    city: "",

    setLocalData() {
        localStorage.setItem("local_store_country", this.country);
        localStorage.setItem("local_store_city", this.city);
    },

    getLocalData() {
        const country = localStorage.getItem("local_store_country") || "BD";
        const city = localStorage.getItem("local_store_city") || "Chittagong";

        return {country, city};
    }
};

const UI = {
    country: "",
    city: "",

    selector() {
        const msgWrapperElm = document.querySelector("#messageWrapper");
        const countryInputElm = document.querySelector("#country");
        const cityInputElm = document.querySelector("#city");
        const submitBtnElm = document.querySelector("#submitBtn");
        const wCityElm = document.querySelector("#wCity");
        const wIconElm = document.querySelector("#wIcon");
        const wFeelElm = document.querySelector("#wFeel");
        const wTempElm = document.querySelector("#wTemp");
        const wPressureElm = document.querySelector("#wPressure");
        const wHumidityElm = document.querySelector("#wHumidity");

        return {msgWrapperElm, countryInputElm, cityInputElm, submitBtnElm, wCityElm, wIconElm, wFeelElm, wTempElm, wPressureElm, wHumidityElm};
    },

    hideMessage() {
        setTimeout(() => {
            const msgElm = document.querySelector("#message");
            if(msgElm) {
                msgElm.remove();
            }
        }, 3000);
    },

    showMessage(msg) {
        const {msgWrapperElm} = this.selector();
        const msgElm = document.createElement("div");
        msgElm.classList.add("alert", "alert-danger");
        msgElm.id = "message";
        msgElm.textContent = msg;
        msgWrapperElm.insertAdjacentElement("afterbegin", msgElm);

        this.hideMessage();
    },

    resetInput() {
        const {countryInputElm, cityInputElm} = this.selector();
        countryInputElm.value = "";
        cityInputElm.value = "";
    },

    validation() {
        const {countryInputElm, cityInputElm} = this.selector();
        if(countryInputElm.value === "" || cityInputElm.value === "") {
            this.showMessage("Invalid inputs!");
            return false;
        }
        return true;
    },

    getInput() {
        const {countryInputElm, cityInputElm} = this.selector();
        const isValid = this.validation();
        if(isValid) {
            const country = countryInputElm.value;
            const city = cityInputElm.value;
            return {country, city};
        }
    },

    getIcon(iconCode) {
        return `https://openweathermap.org/img/w/${iconCode}.png`
    },

    populateUI({weather, main, name: city}) {
        const {wCityElm, wIconElm, wFeelElm, wTempElm, wPressureElm, wHumidityElm} = this.selector();
        
        wCityElm.textContent = city;
        wIconElm.setAttribute("src", this.getIcon(weather[0].icon));
        wFeelElm.textContent = weather[0].main;
        wTempElm.textContent = `Temperature: ${Math.ceil(main.temp)}°C`;
        wPressureElm.textContent = `Pressure: ${main.pressure}hPa`;
        wHumidityElm.textContent = `Humidity: ${main.humidity}%`;
    },

    async populateUIFromLocalData() {
        const {country, city} = localStore.getLocalData();

        tempData.country = country;
        tempData.city = city;
        const data = await tempData.getApiData();

        this.populateUI(data);
    },

    init() {
        const {submitBtnElm} = this.selector();
        submitBtnElm.addEventListener("click", async () => {
            const {country, city} = this.getInput();
            this.resetInput();
            
            localStore.country = country;
            localStore.city = city;
            localStore.setLocalData();

            tempData.country = country;
            tempData.city = city;
            const data = await tempData.getApiData();
            this.populateUI(data);
        });

        window.addEventListener("DOMContentLoaded", this.populateUIFromLocalData.bind(this));
    }
};

UI.init();


