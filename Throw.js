AFRAME.registerComponent("bowling-balls", {
  init: function () {
    this.throwBowlingBall();
  },

  throwBowlingBall: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bowlingBall = document.createElement("a-entity");
  
        bowlingBall.setAttribute("gltf-model", "./models/bowling_ball/scene.gltf");
  
        bowlingBall.setAttribute("scale", { x: 3, y: 3,  z: 3});
  
        var cam = document.querySelector("#camera");
  
        pos = cam.getAttribute("position");
  
        bowlingBall.setAttribute("position", {
          x: pos.x,
          y: pos.y-1.2,
          z: pos.z
        });
  
        var camera = document.querySelector("#camera").object3D;
  
        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
  
        //set the velocity and it's direction
        bowlingBall.setAttribute("velocity", direction.multiplyScalar(-10));
  
        var scene = document.querySelector("#scene");
  
        //set the bowling ball as a dynamic entity
        bowlingBall.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "10"
        });

        //add the collide event listener to the bowling ball
        bowlingBall.addEventListener("collide", this.removeBowlingBall);

        scene.appendChild(bowlingBall);
      }
    });
  },

  removeBowlingBall: function (e) {
    //bowling ball element
    var element = e.detail.target.el;

    //element which is hit
    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("pin")) {
      //impulse and point vector
      var impulse = new CANNON.Vec3(0, 1, -15);
      var worldPoint = new CANNON.Vec3().copy(elementHit.getAttribute("position"));
      elementHit.body.applyImpulse(impulse, worldPoint);

      //remove event listener
      element.removeEventListener("collide", this.removeBowlingBall);
        
      //remove the bullets from the scene
      var scene = document.querySelector("#scene");
      scene.removeChild(element);
    }
  }
});
  
  
  