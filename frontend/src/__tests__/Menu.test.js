import { render, screen, fireEvent } from "@testing-library/react"
import { ShopContext } from "../context/ShopContext"
import Menu from "../components/Menu"


const mockProducts = [
    { _id: 1, name: "Cafe VT", category: "Men", price: 30000 },
    { _id: 2, name: "Women's Dress", category: "Women", price: 30000 },
    { _id: 3, name: "Kids' Toy", category: "Kids", price: 40000 }
  ]
  
  test("displays all products when no category filter is applied", () => {
    render(
      <ShopContext.Provider value={{ products: mockProducts, search: "", showSearch: false }}>
        <Menu />
      </ShopContext.Provider>
    )
  
    expect(screen.getByText("Men's T-shirt")).toBeInTheDocument()
    expect(screen.getByText("Women's Dress")).toBeInTheDocument()
    expect(screen.getByText("Kids' Toy")).toBeInTheDocument()
  })
  