import React from "react";

const GroupCard = ({ meetup }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden w-80">
      <img src={meetup.image} alt={meetup.title} className="w-full h-40 object-cover"/>
      <div className="p-4">
        <h3 className="font-bold text-lg">{meetup.title}</h3>
        <p>{meetup.region} | {meetup.category}</p>
        <p>인원: {meetup.members}/{meetup.maxMembers}</p>
        <p>시간: {meetup.time}</p>
        <p>장소: {meetup.course}</p>
      </div>
    </div>
  );
};

export default GroupCard;