import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";
import Paginate from "../components/Paginate";

const OrderListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("All");
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Filter and sort orders based on selected filters and sort by createdAt
  const filteredAndSortedOrders = orders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  function formatDateTime(dateTimeStr) {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = new Date(dateTimeStr).toLocaleString(
      "en-GB",
      options
    );
    return formattedDate;
  }
  useEffect(() => {
    if (userInfo && (userInfo.isAdmin || userInfo.isManager)) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1em",
        }}
      >
        <div>
          <label>Payment Type:</label>
          <select
            value={selectedPaymentFilter}
            onChange={(e) => setSelectedPaymentFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Cash on Delivery">Cash on Delivery (COD)</option>
            <option value="Bring Swiping Machine">Swipe</option>
            <option value="Card Payment">Card Payment</option>
          </select>
        </div>
        <div>
          <label>Delivery Status:</label>
          <select
            value={selectedDeliveryFilter}
            onChange={(e) => setSelectedDeliveryFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Not Delivered">Not Delivered</option>
          </select>
        </div>
        <div>
          <label>Ordered</label>
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Today">Today</option>
          </select>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>PAYMENT</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{formatDateTime(order.createdAt)}</td>{" "}
                <td>AED {order.totalPrice.toFixed(2)}</td>
                <td>{order.status}</td>
                <td
                  style={{
                    backgroundColor:
                      order.paymentMethod === "Cash on Delivery"
                        ? "#ffc107" // Yellow for COD
                        : order.paymentMethod === "Bring Swiping Machine"
                        ? "#007bff" // Blue for Swipe
                        : order.paymentMethod === "Card Payment" && order.isPaid
                        ? "#28a745" // Green for Paid
                        : order.paymentMethod === "Card Payment" &&
                          !order.isPaid
                        ? "#dc3545" // Red for Failed
                        : "transparent", // Default background color
                    color:
                      order.paymentMethod === "Bring Swiping Machine"
                        ? "#fff"
                        : "#000", // White text for Swipe, black for others
                  }}
                >
                  {order.paymentMethod === "Cash on Delivery"
                    ? "COD"
                    : order.paymentMethod === "Bring Swiping Machine"
                    ? "Swipe"
                    : order.paymentMethod === "Card Payment" && order.isPaid
                    ? "Paid"
                    : order.paymentMethod === "Card Payment" && !order.isPaid
                    ? "Failed"
                    : order.paymentMethod}
                </td>
                <td
                  style={{
                    backgroundColor: order.isDelivered
                      ? "lightgreen"
                      : "lightcoral",
                  }}
                >
                  {order.isDelivered ? "Delivered" : "Not Delivered"}
                </td>
                <td>
                  <LinkContainer to={`/orders/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Paginate pages={pages} page={page} isAdmin={true} />
    </>
  );
};

export default OrderListScreen;
