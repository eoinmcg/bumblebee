import * as THREE from 'three'

/**
 * Checks if two Three.js objects are colliding
 * 
 * @param {Object3D} object1 - First Three.js object (mesh, group, etc.)
 * @param {Object3D} object2 - Second Three.js object (mesh, group, etc.)
 * @param {Object} options - Configuration options
 * @returns {boolean} - True if objects are colliding, false otherwise
 */
export function detectCollision(object1, object2, options = {}) {
  // Default options
  const { 
    method = 'box', // 'box', 'sphere', or 'hybrid'
    precise = false, // If true, updates matrices and computes bounds
  } = options
  
  // Ensure objects exist
  if (!object1 || !object2) return false
  
  // If precise mode is enabled, update world matrices
  if (precise) {
    object1.updateMatrixWorld(true)
    object2.updateMatrixWorld(true)
  }

  // Create bounding boxes
  const box1 = new THREE.Box3().setFromObject(object1)
  const box2 = new THREE.Box3().setFromObject(object2)

  return box1.intersectsBox(box2)

}
