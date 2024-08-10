import React from 'react';

function AboutView() {
  return (
    <div className="about module">
      <h2>Welcome to our project</h2>
      <div className="about-content">
        <p>The PotBot is a smart plant pot that aims to address the issue of plant care by providing a smart solution
          that promotes optimal plant health and reduces the time and expertise needed for plant care. </p>
        <p>Using sensors, the PotBot regularly checks the levels of soil moisture, temperature, and light exposure of         the user’s plant, which the user can monitor remotely through the official application. </p>
        <p>In case of watering needs, the user can opt for automatic watering, made possible with a built-in watering         system and when the plant is in need of care, the user is notified about the environmental data. </p>
        <p>Through the official application, the user can access all of their PotBots and monitor and interact with all of         their plants from a single application. In addition, the PotBot helps promote optimal plant health by
          providing real-time monitoring and care suggestions, ultimately leading to healthier and more vibrant
          plants.</p>
      </div>
    </div>
  )
}


export default AboutView;
