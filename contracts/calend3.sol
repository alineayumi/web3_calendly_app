// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calend3 {
    uint256 rate;
    address payable public owner;

    struct Appointment {
        string title;
        address attendee;
        uint256 startTime;
        uint256 endTime;
        uint256 ammountPaid;
    }

    Appointment[] appointments;

    constructor() {
        owner = payable(msg.sender);
    }

    function getRate() public view returns (uint256) {
        return rate;
    }

    function setRate(uint256 _rate) public {
        require(msg.sender == owner, "Only the owner can set the rate");
        rate = _rate;
    }

    function createAppointment(
        string memory title,
        uint256 startTime,
        uint256 endTime
    ) public payable {
        Appointment memory appointment;
        appointment.ammountPaid = ((endTime - startTime) / 60) * rate;
        require(msg.value >= appointment.ammountPaid, "We require more ether"); // validate ammount

        appointment.title = title;
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        appointment.attendee = msg.sender;

        (bool success, ) = owner.call{value: msg.value}(""); // send ether to the owner
        require(success, "Failed to send Ether");

        appointments.push(appointment);
    }

    function getAppointments() public view returns (Appointment[] memory) {
        return appointments;
    }
}
