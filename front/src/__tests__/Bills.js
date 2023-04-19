/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true)

    })
    // Test unitaire: Bills moins ancien au plus ancien
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    // Test unitaire: Path Nouveau Bill
    // Ajout
    // Test commenté
    test("Then Envoyer vers la nouvelle page de bill", () => {
      Object.defineProperty(
        window,
        "localStorage",
        {value: localStorageMock}
      )
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      )
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const mockBills = new Bills({
        document,
        onNavigate,
        localStorage,
        store: null,
      })
      const btnNewBill = screen.getByTestId("btn-new-bill")
      const mockFunctionHandleClick = jest.fn(mockBills.handleClickNewBill)
      btnNewBill.addEventListener("click", mockFunctionHandleClick)
      fireEvent.click(btnNewBill)
      expect(mockFunctionHandleClick).toHaveBeenCalled()
      expect(mockFunctionHandleClick).toHaveBeenCalledTimes(1)
    })
  })
})
// Test intégration: Get Bills
// Ajout
describe("Given I'm a user connected as Employee", () => {
  describe("When Je suis sur la page Bill", () => {
    // test: recuperation Api simulé GET
    test("fetches bills from mock API GET", async () => {
      localStorageMock.setItem(
        "user",
        JSON.stringify({ type: "Eployee" })
      )
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      expect(screen.findAllByText("test3")).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      beforEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          "localStorage",
          {value: localStorageMock}
        )
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        )
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      // Test unitaire: Erreur 404
    })
  })
  
})