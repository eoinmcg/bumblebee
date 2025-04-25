import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import { useGameStore } from '../store';
import { detectCollision } from '../helpers/collision';
import { Helpers as H } from '../helpers/utils';
import sfx from '../helpers/sfx';

export default function Flower({pos, scale, gameSpeed, player}) {
  scale = scale || 4;
  const body = useRef();
  const models = {
    flower: useGLTF('./flowers-tall.glb'),
    jewel: useGLTF('./jewel.glb'),
  }
  const [model, setModel] = useState();
  const [collected, setCollected] = useState(false);
  const { MAX_X, score, setScore } = useGameStore();


  // Particle system references
  const particles = useRef([]);
  const particlesGroup = useRef();
  const particleLifetime = 2; // seconds

  // Track the player's x position at the time of collision
  const playerXAtCollision = useRef(0);

  // Initialize particles
  useEffect(() => {
  // Create model clone only once during initialization
    // if (!activeModel.current) {
    //   flowerModel.current = models.flower.scene.clone();
    // }
    // if (!jewelModel.current) {
    //   jewelModel.current = models.jewel.scene.clone();
    // }


    // Create 30 particle meshes
    if (particlesGroup.current) {
      for (let i = 0; i < 30; i++) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 8, 8),
          new THREE.MeshStandardMaterial({
            color: 'orange',
            emissive: 'orange',
            emissiveIntensity: 1
          })
        );
        particle.visible = false;
        particle.userData = {
          velocity: new THREE.Vector3(),
          age: 0,
          active: false,
          initialXOffset: 0 // Store offset from player x position
        };
        particlesGroup.current.add(particle);
        particles.current.push(particle);
      }
    }

    resetPos();
  }, []);

  const resetPos = () => {
    if (!body.current) return;

    const y = score > 50 ? H.rndArray([-1.5, 3]) : -1.5;
    body.current.position.y = y;
    setModel(y === 3
      ? models.jewel.scene.clone()
      : models.flower.scene.clone()
    );

    body.current.position.x = H.rnd(-MAX_X, MAX_X);
    body.current.position.z = H.rnd(-20, -40, 'odd') * 10;
    setCollected(false);
  };

  // Function to emit particles at a position
  const emitParticles = (position) => {
    if (!position) return;

    // Store the player's x position at the time of collision
    playerXAtCollision.current = position.x;

    // Activate 20 particles at the player position
    let count = 0;
    particles.current.forEach(particle => {
      if (count >= 20) return;
      if (particle.userData.active) return;

      // Random x offset from player position
      const xOffset = (Math.random() - 0.5) * 1;

      // Position at player with random spread
      particle.position.set(
        position.x + xOffset,
        position.y + (Math.random() - 0.3) * 1,
        position.z + (Math.random() - 0.5) * 1
      );

      // Store the initial x offset from player
      particle.userData.initialXOffset = xOffset;

      // Random velocity - important to set before making visible
      particle.userData.velocity.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 4
      );

      // Reset age and activate
      particle.userData.age = 0;
      particle.userData.active = true;
      particle.visible = true;

      count++;
    });

    return count > 0;
  };

  useFrame((state, delta) => {
    if(!body.current || !player) return;

    // Apply movement
    body.current.position.z += gameSpeed * delta;

    if(model.name === 'jewel') {
      body.current.rotation.y += delta;
    }

    if (!collected) {
      // Check for player collision
      const isColliding = detectCollision(body.current, player.current);
      if (isColliding) {
        sfx('collect');

        // Directly emit particles at player position
        if (player.current) {
          emitParticles(player.current.position);
        }

        setCollected(true);
        console.log(model.name);
        setScore(score + (model.name === 'jewel' ? 10 : 5));
        resetPos();
      }

      // Second movement application - gameplay movement
      body.current.position.z += gameSpeed;
    }

    if (body.current.position.z > 15) {
      resetPos();
    }

    // Current player x position for camera-relative updates
    const currentPlayerX = player.current ? player.current.position.x : 0;
    const xDelta = currentPlayerX - playerXAtCollision.current;

    // Update all active particles
    particles.current.forEach(particle => {
      if (!particle.userData.active) return;

      // Update age
      particle.userData.age += delta;

      // Deactivate old particles
      if (particle.userData.age > particleLifetime) {
        particle.userData.active = false;
        particle.visible = false;
        return;
      }

      // Update position based on velocity
      particle.position.x = playerXAtCollision.current + particle.userData.initialXOffset + 
        xDelta + (particle.userData.velocity.x * particle.userData.age);
      particle.position.y += particle.userData.velocity.y * delta;
      particle.position.z += particle.userData.velocity.z * delta;

      // Apply gravity
      particle.userData.velocity.y -= 9.8 * delta;

      // Scale down as they age but not too small
      const scale = Math.max(0.3, 1 - (particle.userData.age / particleLifetime));
      particle.scale.set(scale, scale, scale);
    });
  });

  return (
    <>
      <group position={pos} ref={body} scale={scale}>
        {model && (
          <primitive
            object={model}
            castShadow
            receiveShadow
          />
        )}
      </group>

      {/* Particle group */}
      <group ref={particlesGroup} />
    </>
  );
}
