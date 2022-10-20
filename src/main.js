import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(
  ".cc-bg  svg > g g:nth-child(1) path"
)
const ccBgColor02 = document.querySelector(
  ".cc-bg  svg > g g:nth-child(2) path"
)
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#4336D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#EF4123", "#FFCB05"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")

const securityCodePattern = {
  mask: "0000",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  mask: "MM{/}AA",
  blocks: {
    AA: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6\d{0,15}/,
      cardtype: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
const form = document.querySelector("form")

addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})

form.addEventListener("submit", (event) => {
  event.preventDefault()
})

const nameCardInput = document.querySelector("#card-holder")

nameCardInput.addEventListener("input", () => {
  const nameCard = document.querySelector(".cc-holder .value")
  nameCard.innerText =
    nameCardInput.value.length === 0 ? "Fulano da Silva" : nameCardInput.value
})

securityCodeMasked.on("accept", () => {
  const ccSecurityCode = document.querySelector(".cc-security .value")
  ccSecurityCode.innerText =
    securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value
})

// A maneira anterior também é aplicável nessa, fiz desse jeito somente para dar exemplos possiveis de se fazer essa função
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked)
})

const updateCardNumber = function (number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.value.length === 0 ? "1234 5678 9012 3456" : number.value
}



expirationDateMasked.on("accept", () => {
  const cardValidate = document.querySelector(".cc-extra .value")
  cardValidate.innerText = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value
})
