import * as THREE from 'three'


/**
 * Checks if two Three.js objects are colliding using box collision
 * Optimized for objects that don't change size but do change position
 * 
 * @param {Object3D} object1 - First Three.js object (mesh, group, etc.)
 * @param {Object3D} object2 - Second Three.js object (mesh, group, etc.)
 * @param {Object} options - Configuration options
 * @returns {boolean} - True if objects are colliding, false otherwise
 */
export function detectCollision2(object1, object2, options = {}) {
  // Default options
  const { 
    precise = false, // If true, updates matrices and computes bounds
    shrinkPercentage = 20, // Percentage to shrink bounding boxes (0-100)
  } = options
  
  // Ensure objects exist
  if (!object1 || !object2) return false
  
  // Cache for size-related data (stored on the objects themselves)
  if (!object1._collisionData || !object2._collisionData || 
      object1._collisionShrink !== shrinkPercentage || 
      object2._collisionShrink !== shrinkPercentage) {
    
    // Initialize or update collision data for object1
    if (!object1._collisionData || object1._collisionShrink !== shrinkPercentage) {
      // Calculate original bounding box
      const originalBox = new THREE.Box3().setFromObject(object1)
      const size = originalBox.getSize(new THREE.Vector3())
      
      // Calculate half extents (half the size in each dimension)
      // Adjust for shrink percentage if needed
      const shrinkFactor = shrinkPercentage / 100
      const halfExtents = new THREE.Vector3(
        size.x * (1 - shrinkFactor) * 0.5,
        size.y * (1 - shrinkFactor) * 0.5,
        size.z * (1 - shrinkFactor) * 0.5
      )
      
      // Store the data
      object1._collisionData = {
        halfExtents,
        lastPosition: new THREE.Vector3()
      }
      object1._collisionShrink = shrinkPercentage
    }
    
    // Initialize or update collision data for object2
    if (!object2._collisionData || object2._collisionShrink !== shrinkPercentage) {
      // Calculate original bounding box
      const originalBox = new THREE.Box3().setFromObject(object2)
      const size = originalBox.getSize(new THREE.Vector3())
      
      // Calculate half extents (half the size in each dimension)
      // Adjust for shrink percentage if needed
      const shrinkFactor = shrinkPercentage / 100
      const halfExtents = new THREE.Vector3(
        size.x * (1 - shrinkFactor) * 0.5,
        size.y * (1 - shrinkFactor) * 0.5,
        size.z * (1 - shrinkFactor) * 0.5
      )
      
      // Store the data
      object2._collisionData = {
        halfExtents,
        lastPosition: new THREE.Vector3()
      }
      object2._collisionShrink = shrinkPercentage
    }
  }
  
  // If precise mode is enabled, update world matrices
  if (precise) {
    object1.updateMatrixWorld(true)
    object2.updateMatrixWorld(true)
  }
  
  // Get current world positions of objects
  const position1 = object1.getWorldPosition(new THREE.Vector3())
  const position2 = object2.getWorldPosition(new THREE.Vector3())
  
  // Update stored positions
  object1._collisionData.lastPosition.copy(position1)
  object2._collisionData.lastPosition.copy(position2)
  
  // Get the half extents
  const halfExtents1 = object1._collisionData.halfExtents
  const halfExtents2 = object2._collisionData.halfExtents
  
  // Check for axis-aligned bounding box (AABB) intersection
  // This is essentially the same as box1.intersectsBox(box2) but without creating new Box3 objects
  
  // For each axis (x, y, z), check if the boxes are separated
  // If they are separated on any axis, they are not colliding
  if (Math.abs(position1.x - position2.x) > (halfExtents1.x + halfExtents2.x)) return false
  if (Math.abs(position1.y - position2.y) > (halfExtents1.y + halfExtents2.y)) return false
  if (Math.abs(position1.z - position2.z) > (halfExtents1.z + halfExtents2.z)) return false
  
  // If we get here, the boxes are colliding
  return true
}

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

/**
 * Hook to check collisions between one object and multiple targets
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} - Collision detection utilities
 */
export function useCollisionDetection(options = {}) {
  const collisionMap = new Map()
  
  /**
   * Check if an object is colliding with any target objects
   * 
   * @param {Object3D} object - Object to check
   * @param {Array<Object3D>} targets - Array of target objects to check against
   * @returns {Array<Object3D>} - Array of objects that are colliding with the input object
   */
  const checkCollisions = (object, targets) => {
    const collisions = []
    
    if (!object || !targets || targets.length === 0) {
      return collisions
    }
    
    for (const target of targets) {
      if (!target) continue
      
      const isColliding = detectCollision(object, target, options)
      
      if (isColliding) {
        collisions.push(target)
      }
      
      // Store collision state for this pair
      const key = `${object.uuid}-${target.uuid}`
      const wasColliding = collisionMap.get(key) || false
      collisionMap.set(key, isColliding)
      
      // Trigger events if collision state changed
      if (isColliding && !wasColliding) {
        target.dispatchEvent({ type: 'collisionenter', object })
        object.dispatchEvent({ type: 'collisionenter', object: target })
      } else if (!isColliding && wasColliding) {
        target.dispatchEvent({ type: 'collisionexit', object })
        object.dispatchEvent({ type: 'collisionexit', object: target })
      }
    }
    
    return collisions
  }
  
  /**
   * Check if two specific objects are colliding
   * 
   * @param {Object3D} object1 - First object
   * @param {Object3D} object2 - Second object
   * @returns {boolean} - True if objects are colliding
   */
  const checkPairCollision = (object1, object2) => {
    return detectCollision(object1, object2, options)
  }
  
  return {
    checkCollisions,
    checkPairCollision
  }
}

