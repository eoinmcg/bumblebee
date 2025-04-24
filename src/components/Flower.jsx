import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { useGameStore } from '../store';
import { detectCollision } from '../helpers/collision';
import { Helpers as H } from '../helpers/utils';
import sfx from '../helpers/sfx';
import { MAX_X } from '../config';

export default function Flower({pos, scale, gameSpeed, player, model}) {
  const body = useRef();
  const flowerModel = useRef();
  scale = scale || 4;
  const [collected, setCollected] = useState(false);
  const [color, setColor] = useState('red');
  const { score, setScore } = useGameStore();

  // Particle system references
  const particles = useRef([]);
  const particlesGroup = useRef();
  const particleLifetime = 2; // seconds

  // Track the player's x position at the time of collision
  const playerXAtCollision = useRef(0);

  // Initialize particles
  useEffect(() => {
  // Create model clone only once during initialization
    if (!flowerModel.current) {
      flowerModel.current = model.scene.clone();
    }
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

    resetPos(true);
  }, [model]);

  const resetPos = (init = false) => {
    if (!body.current) return;

    body.current.position.y = -1.5;
    body.current.position.x = H.rnd(-MAX_X, MAX_X);
    if (init) {
      body.current.position.z = H.rnd(-100, -300);
    } else {
      body.current.position.z = H.rnd(-200, -400);
    }
    setCollected(false);
    setColor(H.rndArray(['red', 'yellow', 'orange']));
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
        setScore(score + 5);
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
        {flowerModel.current && (
          <primitive
            object={flowerModel.current}
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
