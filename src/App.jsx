import React, { useState, useEffect, useRef } from 'react';
import { Car, Clock, Cloud, Route, GitFork, TrafficCone, History, Lightbulb, User, Settings, PlusCircle, Link, MapPin, Wifi, Key, Database, RefreshCcw, Camera, Eye, Siren, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
// --- Helper Functions ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

// --- Simulated Data Storage (Updated for a more 'real-world' map) ---
let initialSimulatedIntersections = [
  { id: 'intA', name: 'Main St & 1st Ave', rsuId: 'rsu1', lanes: [
    { id: 'intA_lane1', name: 'Main St North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intA_lane2', name: 'Main St South', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intA_lane3', name: '1st Ave East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intA_lane4', name: '1st Ave West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intB', name: 'Main St & 2nd Ave', rsuId: 'rsu2', lanes: [
    { id: 'intB_lane1', name: 'Main St North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intB_lane2', name: 'Main St South', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intB_lane3', name: '2nd Ave East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intB_lane4', name: '2nd Ave West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intC', name: 'Oak Ave & 1st St', rsuId: 'rsu3', lanes: [
    { id: 'intC_lane1', name: 'Oak Ave North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intC_lane2', name: 'Oak Ave South', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intC_lane3', name: '1st St East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intC_lane4', name: '1st St West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intD', name: 'Oak Ave & 2nd St', rsuId: 'rsu4', lanes: [
    { id: 'intD_lane1', name: 'Oak Ave North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intD_lane2', name: 'Oak Ave South', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intD_lane3', name: '2nd St East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intD_lane4', name: '2nd St West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intE', name: 'Elm St & 1st Ave', rsuId: 'rsu5', lanes: [
    { id: 'intE_lane1', name: 'Elm St North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intE_lane2', name: 'Elm St South', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intE_lane3', name: '1st Ave East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intE_lane4', name: '1st Ave West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intF', name: 'Elm St & 2nd Ave', rsuId: 'rsu6', lanes: [
    { id: 'intF_lane1', name: 'Elm St North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intF_lane2', name: 'Elm St South', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intF_lane3', name: '2nd Ave East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intF_lane4', name: '2nd Ave West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intG', name: 'Park Blvd & Grand', rsuId: 'rsu7', lanes: [
    { id: 'intG_lane1', name: 'Park Blvd In', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intG_lane2', name: 'Park Blvd Out', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intH', name: 'City Hall Plaza', rsuId: 'rsu8', lanes: [
    { id: 'intH_lane1', name: 'Plaza North', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intH_lane2', name: 'Plaza South', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intI', name: 'River Rd & Bridge', rsuId: 'rsu9', lanes: [
    { id: 'intI_lane1', name: 'River Rd East', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intI_lane2', name: 'River Rd West', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
  { id: 'intJ', name: 'Central Station', rsuId: 'rsu10', lanes: [
    { id: 'intJ_lane1', name: 'Station Entry', vehicles: 0, state: 'red', incomingFrom: [] },
    { id: 'intJ_lane2', name: 'Station Exit', vehicles: 0, state: 'red', incomingFrom: [] },
  ]},
];

let initialSimulatedRSUs = [
  { id: 'rsu1', number: 1, intersectionId: 'intA', interconnectedRSUIds: ['rsu2', 'rsu3', 'rsu5'], simulatedEncryptedKey: 'key_rsu1', status: 'online' },
  { id: 'rsu2', number: 2, intersectionId: 'intB', interconnectedRSUIds: ['rsu1', 'rsu4', 'rsu6'], simulatedEncryptedKey: 'key_rsu2', status: 'online' },
  { id: 'rsu3', number: 3, intersectionId: 'intC', interconnectedRSUIds: ['rsu1', 'rsu4', 'rsu7'], simulatedEncryptedKey: 'key_rsu3', status: 'online' },
  { id: 'rsu4', number: 4, intersectionId: 'intD', interconnectedRSUIds: ['rsu2', 'rsu3', 'rsu8'], simulatedEncryptedKey: 'key_rsu4', status: 'online' },
  { id: 'rsu5', number: 5, intersectionId: 'intE', interconnectedRSUIds: ['rsu1', 'rsu6', 'rsu9'], simulatedEncryptedKey: 'key_rsu5', status: 'online' },
  { id: 'rsu6', number: 6, intersectionId: 'intF', interconnectedRSUIds: ['rsu2', 'rsu5', 'rsu10'], simulatedEncryptedKey: 'key_rsu6', status: 'online' },
  { id: 'rsu7', number: 7, intersectionId: 'intG', interconnectedRSUIds: ['rsu3', 'rsu8', 'rsu9'], simulatedEncryptedKey: 'key_rsu7', status: 'online' },
  { id: 'rsu8', number: 8, intersectionId: 'intH', interconnectedRSUIds: ['rsu4', 'rsu7', 'rsu10'], simulatedEncryptedKey: 'key_rsu8', status: 'online' },
  { id: 'rsu9', number: 9, intersectionId: 'intI', interconnectedRSUIds: ['rsu5', 'rsu7'], simulatedEncryptedKey: 'key_rsu9', status: 'online' },
  { id: 'rsu10', number: 10, intersectionId: 'intJ', interconnectedRSUIds: ['rsu6', 'rsu8'], simulatedEncryptedKey: 'key_rsu10', status: 'online' },
];


// --- Simulated ML Models & Algorithms ---

// Simulated YOLOv8 detection
const simulateYOLOV8Detection = (currentIntersections) => {
  const updatedIntersections = currentIntersections.map(intersection => {
    const updatedLanes = intersection.lanes.map(lane => ({
      ...lane,
      vehicles: getRandomInt(0, 20) // Simulate 0-20 vehicles per lane
    }));
    return { ...intersection, lanes: updatedLanes };
  });
  return updatedIntersections;
};

// Simulated Vehicle Identification & RSU Communication (Trash Map Sharing)
const simulateVehicleIdentificationAndRSUSharing = (currentIntersections, currentRSUs, vehicleRegistryRef) => {
  const newVehicleRegistry = { ...vehicleRegistryRef.current };
  const sharedDataAcrossRSUs = {}; // Data that would be shared between RSUs

  currentIntersections.forEach(intersection => {
    const rsu = currentRSUs.find(r => r.intersectionId === intersection.id);
    if (!rsu) return;

    const vehiclesDetectedAtIntersection = [];
    intersection.lanes.forEach(lane => {
      for (let i = 0; i < lane.vehicles; i++) {
        const vehiclePlate = `ABC${getRandomInt(1000, 9999)}`; // Simulate plate detection
        const vehicleType = ['car', 'truck', 'motorcycle', 'bus'][getRandomInt(0, 3)];
        vehiclesDetectedAtIntersection.push({ plate: vehiclePlate, type: vehicleType });

        // Update global vehicle registry
        newVehicleRegistry[vehiclePlate] = {
          type: vehicleType,
          lastSeenRSU: rsu.id,
          lastSeenTime: new Date().toISOString(),
          currentLane: lane.id,
        };
      }
    });

    // Simulate sharing "encrypted" data with interconnected RSUs
    sharedDataAcrossRSUs[rsu.id] = {
      detectedVehicles: vehiclesDetectedAtIntersection,
      incomingVehiclesFromAdjacent: {}, // This would be populated by adjacent RSUs
      simulatedEncryptedTransfer: `Encrypted Data for RSU ${rsu.number} from its neighbors.`,
    };

    // Simulate incoming vehicles from adjacent RSUs
    rsu.interconnectedRSUIds.forEach(adjRsuId => {
      const incomingCount = getRandomInt(0, 5);
      if (incomingCount > 0) {
        const adjacentRsu = currentRSUs.find(r => r.id === adjRsuId);
        if (adjacentRsu) {
          sharedDataAcrossRSUs[rsu.id].incomingVehiclesFromAdjacent[adjRsuId] = {
            count: incomingCount,
            approxSpeed: `${getRandomInt(20, 60)} km/h`,
          };
          intersection.lanes.forEach(lane => {
            if (lane.name.toLowerCase().includes('bound') || lane.name.toLowerCase().includes('entrance') || lane.name.toLowerCase().includes('access') || lane.name.toLowerCase().includes('st') || lane.name.toLowerCase().includes('ave') || lane.name.toLowerCase().includes('blvd') || lane.name.toLowerCase().includes('rd')) {
                lane.incomingFrom = [...new Set([...lane.incomingFrom, adjacentRsu.name])];
            }
          });
        }
      }
    });
  });

  vehicleRegistryRef.current = newVehicleRegistry; // Update the ref
  return { sharedDataAcrossRSUs, updatedVehicleRegistry: newVehicleRegistry };
};


// Green Wave Algorithm Placeholder
const runGreenWaveAlgorithm = (intersections, sharedDataAcrossRSUs, currentRSUs, emergencyInfo, manualOverrideInfo) => {
  return intersections.map(intersection => {
    const rsu = currentRSUs.find(r => r.intersectionId === intersection.id);
    const rsuSharedData = rsu ? sharedDataAcrossRSUs[rsu.id] : null;

    let updatedLanes = intersection.lanes.map(lane => ({ ...lane, state: 'red' })); // Default all to red

    // --- Emergency Override ---
    if (emergencyInfo.isEmergencyActive && emergencyInfo.emergencyIntersectionId === intersection.id) {
      updatedLanes = updatedLanes.map(lane => {
        if (lane.id === emergencyInfo.emergencyLaneId) {
          return { ...lane, state: 'green' }; // Force emergency lane green
        }
        return { ...lane, state: 'red' }; // Force all other lanes red
      });
      return { ...intersection, lanes: updatedLanes }; // Apply emergency override and return
    }

    // --- Manual Override ---
    if (manualOverrideInfo.manualOverride && manualOverrideInfo.manualOverrideIntersectionId === intersection.id) {
      updatedLanes = updatedLanes.map(lane => {
        if (lane.id === manualOverrideInfo.manualOverrideLaneId) {
          return { ...lane, state: manualOverrideInfo.manualOverrideState }; // Apply manual state
        }
        return { ...lane, state: 'red' }; // Others red for manual control
      });
      return { ...intersection, lanes: updatedLanes }; // Apply manual override and return
    }

    // --- Normal Green Wave Logic (if no emergency or manual override) ---
    let totalVehiclesAtIntersection = 0;
    intersection.lanes.forEach(lane => {
      totalVehiclesAtIntersection += lane.vehicles;
    });

    updatedLanes = intersection.lanes.map(lane => {
      let newState = 'red';

      if (lane.vehicles > 15) {
        newState = 'green';
      } else if (lane.vehicles > 5) {
        newState = 'yellow';
      }

      if (rsuSharedData && rsuSharedData.incomingVehiclesFromAdjacent) {
        const incomingCount = Object.values(rsuSharedData.incomingVehiclesFromAdjacent).reduce((sum, data) => sum + data.count, 0);
        if (incomingCount > 0 && totalVehiclesAtIntersection < 10) {
          if (lane.name.includes('bound') && getRandomInt(0, 1) === 1) {
             newState = 'green';
          }
        }
      }
      return { ...lane, state: newState };
    });

    let greenLaneSet = false;
    for (const lane of updatedLanes) {
      if (lane.state === 'green') {
        if (!greenLaneSet) {
          greenLaneSet = true;
        } else {
          lane.state = 'red';
        }
      }
    }
    if (!greenLaneSet && updatedLanes.length > 0) {
      let maxVehicles = -1;
      let laneToTurnGreen = null;
      for (const lane of updatedLanes) {
        if (lane.vehicles > maxVehicles) {
          maxVehicles = lane.vehicles;
          laneToTurnGreen = lane;
        }
      }
      if (laneToTurnGreen) {
        laneToTurnGreen.state = 'green';
      }
    }

    return { ...intersection, lanes: updatedLanes };
  });
};

// Simulated Routing Algorithm (Dijkstra-like)
const runRoutingAlgorithm = (startIntersectionId, endIntersectionId, currentIntersections, historicalData) => {
  if (!startIntersectionId || !endIntersectionId) {
    return { path: [], congestionEstimate: 'N/A', message: 'Please select both start and end intersections.', eta: 'N/A' };
  }

  const startInt = currentIntersections.find(i => i.id === startIntersectionId);
  const endInt = currentIntersections.find(i => i.id === endIntersectionId);

  if (!startInt || !endInt) {
    return { path: [], congestionEstimate: 'N/A', message: 'Invalid intersection IDs.', eta: 'N/A' };
  }

  // Define a simplified graph for routing based on the new map layout
  // Node: intersection ID, Edges: adjacent intersection IDs
  const graph = {
    'intA': ['intB', 'intC', 'intE'],
    'intB': ['intA', 'intD', 'intF'],
    'intC': ['intA', 'intD', 'intG'],
    'intD': ['intB', 'intC', 'intH'],
    'intE': ['intA', 'intF', 'intI'],
    'intF': ['intB', 'intE', 'intJ'],
    'intG': ['intC', 'intH', 'intI'],
    'intH': ['intD', 'intG', 'intJ'],
    'intI': ['intE', 'intG'],
    'intJ': ['intF', 'intH'],
  };

  // Dijkstra's algorithm simulation
  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(graph));

  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startIntersectionId] = 0;

  while (unvisited.size > 0) {
    let currentNode = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    }

    if (currentNode === null) break; // No path found

    unvisited.delete(currentNode);

    for (const neighborId of graph[currentNode]) {
      const neighbor = currentIntersections.find(int => int.id === neighborId);
      if (!neighbor) continue;

      const currentInt = currentIntersections.find(int => int.id === currentNode);
      const edgeWeight = getCongestionScore(currentInt.name) + getCongestionScore(neighbor.name); // Cost is sum of congestion at both ends

      const alt = distances[currentNode] + edgeWeight;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentNode;
      }
    }
  }

  // Reconstruct path
  const pathIds = [];
  let current = endIntersectionId;
  while (current !== null) {
    pathIds.unshift(current);
    current = previous[current];
  }

  const bestPath = pathIds.map(id => currentIntersections.find(int => int.id === id)?.name || id);

  let minCongestionScore = distances[endIntersectionId];
  let congestionEstimate = 'Low';
  let simulatedTravelTimeMinutes = getRandomInt(10, 30);

  if (minCongestionScore === Infinity) {
    return { path: [], congestionEstimate: 'N/A', message: 'No path found between selected intersections.', eta: 'N/A' };
  }

  if (minCongestionScore > 100) { // Adjusted threshold for new scoring
    congestionEstimate = 'High';
    simulatedTravelTimeMinutes = simulatedTravelTimeMinutes * getRandomInt(2, 3);
  } else if (minCongestionScore > 40) {
    congestionEstimate = 'Medium';
    simulatedTravelTimeMinutes = simulatedTravelTimeMinutes * getRandomInt(1, 2);
  }
  bestEta = `${simulatedTravelTimeMinutes} mins`;

  // Fix: Changed 'const' to 'let' for bestMessage
  let bestMessage = `Optimal path: ${bestPath.join(' -> ')}. Estimated congestion: ${congestionEstimate}.`;
  if (congestionEstimate === 'High') {
    bestMessage += ' Consider leaving earlier or taking an alternative mode of transport.';
  } else if (congestionEstimate === 'Medium') {
    bestMessage += ' Expect some delays.';
  } else {
    bestMessage += ' Expect smooth traffic.';
  }

  return { path: bestPath, congestionEstimate, message: bestMessage, eta: bestEta };
};


// --- React App Component ---
function App() {
  const [intersections, setIntersections] = useState(initialSimulatedIntersections);
  const [rsus, setRsus] = useState(initialSimulatedRSUs);
  const [view, setView] = useState('user'); // 'user' or 'admin'
  const [isLoading, setIsLoading] = useState(false);
  const [routeResult, setRouteResult] = useState({ path: [], congestionEstimate: 'N/A', message: '', eta: 'N/A' });

  // Admin form states
  const [newIntersectionName, setNewIntersectionName] = useState('');
  const [newRsuNumber, setNewRsuNumber] = useState('');
  const [newRsuIntersectionId, setNewRsuIntersectionId] = useState('');
  const [newRsuInterconnectedIds, setNewRsuInterconnectedIds] = useState('');

  // Admin Camera View state
  const [selectedCameraIntersectionId, setSelectedCameraIntersectionId] = useState(intersections[0]?.id || '');

  // Emergency Feature States
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyIntersectionId, setEmergencyIntersectionId] = useState('');
  const [emergencyLaneId, setEmergencyLaneId] = useState('');

  // Manual Override States
  const [manualOverride, setManualOverride] = useState(false);
  const [manualOverrideIntersectionId, setManualOverrideIntersectionId] = useState('');
  const [manualOverrideLaneId, setManualOverrideLaneId] = useState('');
  const [manualOverrideState, setManualOverrideState] = useState('red'); // 'red', 'yellow', 'green'


  // In-memory "database" for historical data and vehicle registry
  const historicalTrafficData = useRef([]); // Stores historical congestion data for ML training
  const vehicleRegistry = useRef({}); // Stores vehicle number plates and last seen RSU

  // Refs to hold the latest state values for use inside the interval
  const latestIntersections = useRef(intersections);
  const latestRsus = useRef(rsus);
  const latestIsEmergencyActive = useRef(isEmergencyActive);
  const latestEmergencyIntersectionId = useRef(emergencyIntersectionId);
  const latestEmergencyLaneId = useRef(emergencyLaneId);
  const latestManualOverride = useRef(manualOverride);
  const latestManualOverrideIntersectionId = useRef(manualOverrideIntersectionId);
  const latestManualOverrideLaneId = useRef(manualOverrideLaneId);
  const latestManualOverrideState = useRef(manualOverrideState);


  // Update refs whenever state changes
  useEffect(() => { latestIntersections.current = intersections; }, [intersections]);
  useEffect(() => { latestRsus.current = rsus; }, [rsus]);
  useEffect(() => { latestIsEmergencyActive.current = isEmergencyActive; }, [isEmergencyActive]);
  useEffect(() => { latestEmergencyIntersectionId.current = emergencyIntersectionId; }, [emergencyIntersectionId]);
  useEffect(() => { latestEmergencyLaneId.current = emergencyLaneId; }, [emergencyLaneId]);
  useEffect(() => { latestManualOverride.current = manualOverride; }, [manualOverride]);
  useEffect(() => { latestManualOverrideIntersectionId.current = manualOverrideIntersectionId; }, [manualOverrideIntersectionId]);
  useEffect(() => { latestManualOverrideLaneId.current = manualOverrideLaneId; }, [manualOverrideLaneId]);
  useEffect(() => { latestManualOverrideState.current = manualOverrideState; }, [manualOverrideState]);


  // Simulation interval ref
  const simulationIntervalRef = useRef(null);

  // --- Core Simulation Loop ---
  useEffect(() => {
    const runSimulationStep = () => {
      setIsLoading(true);

      // Use the latest state values from refs
      const currentIntersections = latestIntersections.current;
      const currentRsus = latestRsus.current;
      const currentEmergencyInfo = {
        isEmergencyActive: latestIsEmergencyActive.current,
        emergencyIntersectionId: latestEmergencyIntersectionId.current,
        emergencyLaneId: latestEmergencyLaneId.current
      };
      const currentManualOverrideInfo = {
        manualOverride: latestManualOverride.current,
        manualOverrideIntersectionId: latestManualOverrideIntersectionId.current,
        manualOverrideLaneId: latestManualOverrideLaneId.current,
        manualOverrideState: latestManualOverrideState.current
      };

      // Step 1: Simulate YOLOv8 detection
      const updatedIntersectionsAfterYOLO = simulateYOLOV8Detection(currentIntersections);

      // Step 2: Simulate Vehicle Identification & RSU Communication
      const { sharedDataAcrossRSUs } = simulateVehicleIdentificationAndRSUSharing(updatedIntersectionsAfterYOLO, currentRsus, vehicleRegistry);

      // Step 3: Run Green Wave Algorithm (with emergency and manual overrides)
      const finalIntersections = runGreenWaveAlgorithm(
        updatedIntersectionsAfterYOLO,
        sharedDataAcrossRSUs,
        currentRsus,
        currentEmergencyInfo,
        currentManualOverrideInfo
      );

      // Step 4: Store Historical Data (Simulated Cloud/Database)
      finalIntersections.forEach(intersection => {
        const totalVehicles = intersection.lanes.reduce((sum, lane) => sum + lane.vehicles, 0);
        let congestionLevel = 'low';
        if (totalVehicles > 50) congestionLevel = 'high';
        else if (totalVehicles > 20) congestionLevel = 'medium';

        historicalTrafficData.current.push({
          timestamp: new Date().toISOString(),
          intersectionId: intersection.id,
          intersectionName: intersection.name,
          laneData: intersection.lanes.map(lane => ({ id: lane.id, vehicles: lane.vehicles, state: lane.state })),
          totalVehicles: totalVehicles,
          congestionLevel: congestionLevel,
        });
      });

      // Keep historical data to a manageable size (e.g., last 100 entries)
      if (historicalTrafficData.current.length > 100) {
        historicalTrafficData.current = historicalTrafficData.current.slice(historicalTrafficData.current.length - 100);
      }

      setIntersections(finalIntersections); // Update state, triggers re-render
      setIsLoading(false);
    };

    // Initial run
    runSimulationStep();

    // Set up interval for continuous simulation (e.g., every 5 seconds)
    simulationIntervalRef.current = setInterval(runSimulationStep, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(simulationIntervalRef.current);
  }, []); // Empty dependency array: runs only once on mount and handles interval lifecycle

  // --- Admin Functions ---
  const handleAddIntersection = (e) => {
    e.preventDefault();
    if (newIntersectionName.trim() === '') return;

    const newId = `int${generateUniqueId()}`;
    const newInt = {
      id: newId,
      name: newIntersectionName,
      rsuId: '', // Will be linked to an RSU later
      lanes: [
        { id: `${newId}_lane1`, name: 'Northbound', vehicles: 0, state: 'red', incomingFrom: [] },
        { id: `${newId}_lane2`, name: 'Southbound', vehicles: 0, state: 'red', incomingFrom: [] },
        { id: `${newId}_lane3`, name: 'Eastbound', vehicles: 0, state: 'red', incomingFrom: [] },
        { id: `${newId}_lane4`, name: 'Westbound', vehicles: 0, state: 'red', incomingFrom: [] },
      ],
    };
    setIntersections([...intersections, newInt]);
    setNewIntersectionName('');
  };

  const handleAddRSU = (e) => {
    e.preventDefault();
    if (newRsuNumber.trim() === '' || newRsuIntersectionId.trim() === '') return;

    const intersectionExists = intersections.some(int => int.id === newRsuIntersectionId);
    if (!intersectionExists) {
      alert('Error: Intersection ID does not exist. Please add the intersection first.');
      return;
    }

    const interconnectedIdsArray = newRsuInterconnectedIds.split(',').map(id => id.trim()).filter(id => id !== '');
    const newId = `rsu${generateUniqueId()}`;
    const newRSU = {
      id: newId,
      number: parseInt(newRsuNumber),
      intersectionId: newRsuIntersectionId,
      interconnectedRSUIds: interconnectedIdsArray,
      simulatedEncryptedKey: `key_rsu${newRsuNumber}_${generateUniqueId()}`,
      status: 'online', // New RSU is online by default
    };
    setRsus([...rsus, newRSU]);

    // Link RSU to intersection
    setIntersections(intersections.map(int =>
      int.id === newRsuIntersectionId ? { ...int, rsuId: newId } : int
    ));

    setNewRsuNumber('');
    setNewRsuIntersectionId('');
    setNewRsuInterconnectedIds('');
  };

  const handleSimulateEmergency = () => {
    if (!emergencyIntersectionId || !emergencyLaneId) {
      alert('Please select an intersection and a lane for the emergency.');
      return;
    }
    setIsEmergencyActive(true);
    // Emergency will automatically clear after 15 seconds (simulated)
    setTimeout(() => {
      setIsEmergencyActive(false);
      setEmergencyIntersectionId('');
      setEmergencyLaneId('');
      alert('Simulated emergency cleared!');
    }, 15000);
  };

  const handleSetManualOverride = () => {
    if (!manualOverrideIntersectionId || !manualOverrideLaneId || !manualOverrideState) {
      alert('Please select an intersection, lane, and state for manual override.');
      return;
    }
    setManualOverride(true);
    alert(`Manual override set for ${intersections.find(i => i.id === manualOverrideIntersectionId)?.name}, Lane ${manualOverrideLaneId.split('_').pop()} to ${manualOverrideState.toUpperCase()}`);
  };

  const handleClearManualOverride = () => {
    setManualOverride(false);
    setManualOverrideIntersectionId('');
    setManualOverrideLaneId('');
    setManualOverrideState('red');
    alert('Manual override cleared.');
  };

  // --- User Functions ---
  const handleRouteRequest = (startId, endId) => {
    setIsLoading(true);
    // Simulate network delay for routing calculation
    setTimeout(() => {
      const result = runRoutingAlgorithm(startId, endId, intersections, historicalTrafficData.current);
      setRouteResult(result);
      setIsLoading(false);
    }, 1000);
  };

  // --- UI Components ---
  const LaneStatus = ({ lane }) => {
    let colorClass = 'bg-gray-500'; // Default
    if (lane.state === 'green') colorClass = 'bg-green-500';
    else if (lane.state === 'yellow') colorClass = 'bg-yellow-500';
    else if (lane.state === 'red') colorClass = 'bg-red-500';

    return (
      <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg shadow-inner mb-2">
        <span className="font-medium text-gray-200">{lane.name}:</span>
        <div className="flex items-center">
          <span className="text-blue-300 mr-2">{lane.vehicles} vehicles</span>
          <div className={`w-5 h-5 rounded-full ${colorClass} border border-gray-600`}></div>
        </div>
      </div>
    );
  };

  const IntersectionCard = ({ intersection }) => {
    const rsu = rsus.find(r => r.intersectionId === intersection.id);
    const totalVehicles = intersection.lanes.reduce((sum, lane) => sum + lane.vehicles, 0);

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-green-500 transition-all duration-300">
        <h3 className="text-2xl font-bold mb-3 text-green-400 flex items-center">
          <MapPin className="mr-3" size={24} /> {intersection.name}
        </h3>
        <p className="text-gray-300 mb-2">
          <span className="font-semibold">Intersection ID:</span> {intersection.id}
        </p>
        <p className="text-gray-300 mb-4">
          <span className="font-semibold">Associated RSU:</span> {rsu ? `RSU ${rsu.number} (ID: ${rsu.id})` : 'N/A'}
        </p>
        <div className="grid grid-cols-1 gap-2">
          {intersection.lanes.map(lane => (
            <LaneStatus key={lane.id} lane={lane} />
          ))}
        </div>
        <p className="text-lg font-semibold text-gray-200 mt-4">
          Total Vehicles: <span className="text-blue-300">{totalVehicles}</span>
        </p>
      </div>
    );
  };

  const CameraView = ({ intersection }) => {
    if (!intersection) {
      return <p className="text-gray-400 text-center py-8">Select an intersection to view its camera feed.</p>;
    }

    const rsu = rsus.find(r => r.intersectionId === intersection.id);
    const totalVehicles = intersection.lanes.reduce((sum, lane) => sum + lane.vehicles, 0);

    return (
      <div className="bg-gray-700 p-6 rounded-xl shadow-inner border border-gray-600">
        <h3 className="text-2xl font-bold mb-4 text-orange-300 flex items-center">
          <Camera className="mr-3" size={28} /> Live Camera Feed: {intersection.name}
        </h3>
        <p className="text-gray-300 mb-4">
          <span className="font-semibold">Intersection ID:</span> {intersection.id} |{' '}
          <span className="font-semibold">Associated RSU:</span> {rsu ? `RSU ${rsu.number}` : 'N/A'}
        </p>

        {/* Simulated Town Map / Intersection Layout */}
        <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden mb-6 flex items-center justify-center border border-gray-600">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 opacity-75"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Center Intersection */}
            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-400 font-bold z-10">
              <span className="text-center">Intersection<br/>Core</span>
            </div>

            {/* Lanes */}
            {intersection.lanes.map((lane, index) => {
              let laneColor = 'bg-gray-500';
              if (lane.state === 'green') laneColor = 'bg-green-500';
              else if (lane.state === 'yellow') laneColor = 'bg-yellow-500';
              else if (lane.state === 'red') laneColor = 'bg-red-500';

              // Positioning for a simplified cross-intersection map
              let positionClasses = '';
              let textPositionClasses = '';
              let incomingPositionClasses = '';

              if (lane.name.toLowerCase().includes('north')) {
                positionClasses = 'absolute top-0 left-1/2 -translate-x-1/2 w-16 h-32 transform -translate-y-1/2';
                textPositionClasses = 'absolute top-2 left-1/2 -translate-x-1/2 text-center';
                incomingPositionClasses = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8';
              } else if (lane.name.toLowerCase().includes('south')) {
                positionClasses = 'absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-32 transform translate-y-1/2';
                textPositionClasses = 'absolute bottom-2 left-1/2 -translate-x-1/2 text-center';
                incomingPositionClasses = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-8';
              } else if (lane.name.toLowerCase().includes('east')) {
                positionClasses = 'absolute right-0 top-1/2 -translate-y-1/2 h-16 w-32 transform translate-x-1/2';
                textPositionClasses = 'absolute top-1/2 right-2 -translate-y-1/2 text-right';
                incomingPositionClasses = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-8';
              } else if (lane.name.toLowerCase().includes('west')) {
                positionClasses = 'absolute left-0 top-1/2 -translate-y-1/2 h-16 w-32 transform -translate-x-1/2';
                textPositionClasses = 'absolute top-1/2 left-2 -translate-y-1/2 text-left';
                incomingPositionClasses = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mr-8';
              } else { // Generic lanes for other intersection types (simplified for visual representation)
                positionClasses = `absolute w-24 h-12 bg-gray-500 rounded-md transform rotate-${index * 45} translate-x-${index % 2 === 0 ? '16' : '-16'} translate-y-${index % 2 === 0 ? '16' : '-16'}`;
                textPositionClasses = `absolute text-center`;
                incomingPositionClasses = `absolute`;
              }


              return (
                <div key={lane.id} className={`absolute ${positionClasses} bg-gray-500 border-2 border-gray-400 flex items-center justify-center rounded-md z-0`}>
                  <div className={`w-8 h-8 rounded-full ${laneColor} border-2 border-gray-300 shadow-md`}></div>
                  <div className={`absolute text-xs font-semibold text-gray-100 ${textPositionClasses}`}>
                    {lane.name} <br/> ({lane.vehicles} cars)
                  </div>
                  {lane.incomingFrom.length > 0 && (
                    <div className={`absolute text-xxs text-blue-200 bg-blue-800 px-1 py-0.5 rounded-full ${incomingPositionClasses}`}>
                      <Car size={10} className="inline-block mr-0.5" /> Incoming: {lane.incomingFrom.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center">
            <Eye size={14} className="mr-1" /> Live Feed (Simulated)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intersection.lanes.map(lane => (
            <div key={lane.id} className="bg-gray-800 p-3 rounded-lg shadow-inner">
              <h4 className="text-md font-semibold text-gray-200 mb-1">{lane.name}</h4>
              <p className="text-sm text-blue-300">Vehicles: {lane.vehicles}</p>
              <p className="text-sm text-gray-300 flex items-center">
                Light Status:
                <span className={`w-4 h-4 rounded-full ml-2 ${lane.state === 'green' ? 'bg-green-500' : lane.state === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                <span className="ml-2 font-bold capitalize">{lane.state}</span>
              </p>
              {lane.incomingFrom.length > 0 && (
                <p className="text-xs text-blue-200 mt-1">
                  Incoming from: {lane.incomingFrom.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-lg font-semibold text-gray-200 mt-6 text-center">
          Total Vehicles at Intersection: <span className="text-blue-300">{totalVehicles}</span>
        </p>
      </div>
    );
  };

  // New TrafficMap Component
  const TrafficMap = ({ intersections, rsus, currentRoutePath }) => {
    // Define positions for intersections on a simplified grid representing a city
    const intersectionPositions = {
      'intA': { x: 100, y: 100 }, // Main St & 1st Ave
      'intB': { x: 300, y: 100 }, // Main St & 2nd Ave
      'intC': { x: 100, y: 300 }, // Oak Ave & 1st St
      'intD': { x: 300, y: 300 }, // Oak Ave & 2nd St
      'intE': { x: 100, y: 500 }, // Elm St & 1st Ave
      'intF': { x: 300, y: 500 }, // Elm St & 2nd Ave
      'intG': { x: 500, y: 100 }, // Park Blvd & Grand
      'intH': { x: 500, y: 300 }, // City Hall Plaza
      'intI': { x: 500, y: 500 }, // River Rd & Bridge
      'intJ': { x: 700, y: 300 }, // Central Station (off-grid for variety)
    };

    const getCongestionColor = (intersectionId) => {
      const intersection = intersections.find(int => int.id === intersectionId);
      if (!intersection) return 'gray';
      const totalVehicles = intersection.lanes.reduce((sum, lane) => sum + lane.vehicles, 0);
      if (totalVehicles > 50) return 'red';
      if (totalVehicles > 20) return 'yellow';
      return 'green';
    };

    const getLineColor = (fromIntId, toIntId) => {
      const fromColor = getCongestionColor(fromIntId);
      const toColor = getCongestionColor(toIntId);
      // If any part of the connection is red/yellow, the line reflects that congestion
      if (fromColor === 'red' || toColor === 'red') return 'red';
      if (fromColor === 'yellow' || toColor === 'yellow') return 'yellow';
      return 'green';
    };

    const connections = [];
    rsus.forEach(rsu => {
      const fromIntId = rsu.intersectionId;
      rsu.interconnectedRSUIds.forEach(adjRsuId => {
        const toIntId = rsus.find(r => r.id === adjRsuId)?.intersectionId;
        if (fromIntId && toIntId && fromIntId !== toIntId) {
          // Add connection only once (undirected graph for visualization)
          if (!connections.some(c => (c.from === fromIntId && c.to === toIntId) || (c.from === toIntId && c.to === fromIntId))) {
            connections.push({ from: fromIntId, to: toIntId });
          }
        }
      });
    });

    // Determine if a connection is part of the current suggested route
    const isPartOfRoute = (fromId, toId) => {
      if (!currentRoutePath || currentRoutePath.length < 2) return false;
      const fromName = intersections.find(int => int.id === fromId)?.name;
      const toName = intersections.find(int => int.id === toId)?.name;

      if (!fromName || !toName) return false;

      for (let i = 0; i < currentRoutePath.length - 1; i++) {
        const pathFromName = currentRoutePath[i];
        const pathToName = currentRoutePath[i+1];
        if ((pathFromName === fromName && pathToName === toName) || (pathFromName === toName && pathToName === fromName)) {
          return true;
        }
      }
      return false;
    };


    return (
      <div className="bg-gray-700 p-6 rounded-xl shadow-inner border border-gray-600 mt-8">
        <h3 className="text-xl font-bold mb-4 text-orange-300 flex items-center">
          <MapPin className="mr-2" size={24} /> City Traffic Map Overview
        </h3>
        <p className="text-gray-300 mb-4 text-sm">
          Visual representation of intersection congestion and traffic flow.
          <span className="ml-2 text-green-400">Green: Free</span>,
          <span className="ml-2 text-yellow-400">Yellow: Busy</span>,
          <span className="ml-2 text-red-400">Red: Congested</span>.
          <span className="ml-2 text-blue-400 font-bold">Dashed Blue: Suggested Route</span>
        </p>

        <svg width="100%" height="650" viewBox="0 0 800 650" className="bg-gray-800 rounded-lg border border-gray-600">
          {/* Background roads (fixed) */}
          <line x1="100" y1="0" x2="100" y2="600" className="stroke-gray-600 stroke-8" /> {/* 1st Ave */}
          <line x1="300" y1="0" x2="300" y2="600" className="stroke-gray-600 stroke-8" /> {/* 2nd Ave */}
          <line x1="500" y1="0" x2="500" y2="600" className="stroke-gray-600 stroke-8" /> {/* Grand Ave / River Rd */}
          <line x1="0" y1="100" x2="600" y2="100" className="stroke-gray-600 stroke-8" /> {/* Main St */}
          <line x1="0" y1="300" x2="600" y2="300" className="stroke-gray-600 stroke-8" /> {/* Oak Ave */}
          <line x1="0" y1="500" x2="600" y2="500" className="stroke-gray-600 stroke-8" /> {/* Elm St */}
          <line x1="600" y1="300" x2="750" y2="300" className="stroke-gray-600 stroke-8" /> {/* Road to Central Station */}


          {/* Draw connections (roads with dynamic congestion and traffic flow) */}
          {connections.map((conn, index) => {
            const p1 = intersectionPositions[conn.from];
            const p2 = intersectionPositions[conn.to];
            if (!p1 || !p2) return null;

            const color = getLineColor(conn.from, conn.to);
            let strokeColor = 'stroke-gray-500';
            if (color === 'red') strokeColor = 'stroke-red-500';
            else if (color === 'yellow') strokeColor = 'stroke-yellow-500';
            else if (color === 'green') strokeColor = 'stroke-green-500';

            const isRouteSegment = isPartOfRoute(conn.from, conn.to);
            const routeStroke = isRouteSegment ? 'stroke-blue-400 stroke-dasharray-5,5' : '';
            const strokeWidth = isRouteSegment ? 'stroke-4' : 'stroke-2';


            return (
              <line
                key={index}
                x1={p1.x} y1={p1.y}
                x2={p2.x} y2={p2.y}
                className={`${strokeColor} ${strokeWidth} ${routeStroke}`}
              >
                {/* Simple animation for traffic flow */}
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="10"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </line>
            );
          })}

          {/* Draw intersections */}
          {intersections.map(intersection => {
            const pos = intersectionPositions[intersection.id];
            if (!pos) return null;

            const color = getCongestionColor(intersection.id);
            let fillColor = 'fill-gray-500';
            if (color === 'red') fillColor = 'fill-red-500';
            else if (color === 'yellow') fillColor = 'fill-yellow-500';
            else if (color === 'green') fillColor = 'fill-green-500';

            const totalVehicles = intersection.lanes.reduce((sum, lane) => sum + lane.vehicles, 0);

            return (
              <g key={intersection.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  className={`${fillColor} stroke-gray-300 stroke-2`}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                >
                  {intersection.name.split(' ')[0]} {/* Show first word of name */}
                </text>
                <title>
                  {intersection.name} - Vehicles: {totalVehicles} - Congestion: {color.toUpperCase()}
                </title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-inter p-4 sm:p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-2">
        Smart Traffic Management System
      </h1>

      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center text-green-400">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
            <p className="text-xl font-semibold">Processing data...</p>
          </div>
        </div>
      )}

      {isEmergencyActive && (
        <div className="fixed top-0 left-0 w-full bg-red-800 text-white text-center py-3 z-50 flex items-center justify-center animate-pulse">
          <Siren className="mr-3 animate-bounce" size={24} />
          <span className="text-xl font-bold">EMERGENCY ACTIVE! Priority for {intersections.find(i => i.id === emergencyIntersectionId)?.name}</span>
          <Siren className="ml-3 animate-bounce" size={24} />
        </div>
      )}

      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setView('user')}
          className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center ${
            view === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <User className="mr-2" size={20} /> Daily User
        </button>
        <button
          onClick={() => setView('admin')}
          className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center ${
            view === 'admin' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Settings className="mr-2" size={20} /> Administrator
        </button>
      </div>

      {/* --- Daily User View --- */}
      {view === 'user' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-blue-400 flex items-center">
              <Route className="mr-3" size={32} /> Route Planner
            </h2>
            <div className="mb-4">
              <label htmlFor="startIntersection" className="block text-gray-300 text-sm font-bold mb-2">
                Start Intersection:
              </label>
              <select
                id="startIntersection"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                onChange={(e) => handleRouteRequest(e.target.value, document.getElementById('endIntersection').value)}
              >
                <option value="">Select Start</option>
                {intersections.map(int => (
                  <option key={int.id} value={int.id}>{int.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="endIntersection" className="block text-gray-300 text-sm font-bold mb-2">
                End Intersection:
              </label>
              <select
                id="endIntersection"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                onChange={(e) => handleRouteRequest(document.getElementById('startIntersection').value, e.target.value)}
              >
                <option value="">Select End</option>
                {intersections.map(int => (
                  <option key={int.id} value={int.id}>{int.name}</option>
                ))}
              </select>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-blue-300 mb-2 flex items-center">
                <Lightbulb className="mr-2" size={20} /> Suggested Route:
              </h3>
              {routeResult.path.length > 0 ? (
                <>
                  <p className="text-gray-200 font-bold text-lg mb-2" dangerouslySetInnerHTML={{ __html: routeResult.path.join(' <span class="text-gray-400">-></span> ') }} />
                  <p className="text-gray-300 text-md">
                    <span className="font-semibold">Estimated Congestion:</span>{' '}
                    <span className={`${routeResult.congestionEstimate === 'High' ? 'text-red-400' : routeResult.congestionEstimate === 'Medium' ? 'text-yellow-400' : 'text-green-400'} font-bold`}>
                      {routeResult.congestionEstimate}
                    </span>
                  </p>
                  <p className="text-gray-300 text-md">
                    <span className="font-semibold">Estimated Travel Time:</span>{' '}
                    <span className="text-purple-300 font-bold">{routeResult.eta}</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-2 italic">{routeResult.message}</p>
                </>
              ) : (
                <p className="text-gray-400">Select start and end points to get a route.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center">
              <TrafficCone className="mr-3" size={32} /> Real-time Traffic Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intersections.map(intersection => (
                <div key={intersection.id} className="bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h3 className="text-xl font-semibold text-blue-300 mb-2">{intersection.name}</h3>
                  {intersection.lanes.map(lane => (
                    <div key={lane.id} className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-300">{lane.name}:</span>
                      <div className="flex items-center">
                        <span className="text-blue-200 mr-2">{lane.vehicles} vehicles</span>
                        <div className={`w-4 h-4 rounded-full ${lane.state === 'green' ? 'bg-green-500' : lane.state === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-6 flex items-center">
              <RefreshCcw className="mr-2 animate-spin-slow" size={16} /> Data updates every 5 seconds.
            </p>

            <h3 className="text-xl font-bold mb-4 text-purple-300 flex items-center mt-8">
              <Cloud className="mr-2" size={24} /> City-wide Congestion Overview
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {intersections.map(int => {
                const totalVehicles = int.lanes.reduce((sum, lane) => sum + lane.vehicles, 0);
                let congestionColor = 'text-green-400';
                let congestionStatus = 'Low';
                if (totalVehicles > 50) { congestionColor = 'text-red-400'; congestionStatus = 'High'; }
                else if (totalVehicles > 20) { congestionColor = 'text-yellow-400'; congestionStatus = 'Medium'; }

                return (
                  <div key={int.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg">
                    <span className="text-gray-300">{int.name}:</span>
                    <span className={`${congestionColor} font-bold`}>{congestionStatus}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Traffic Map Component */}
          <div className="lg:col-span-2">
            <TrafficMap intersections={intersections} rsus={rsus} currentRoutePath={routeResult.path} />
          </div>
        </div>
      )}

      {/* --- Administrator View --- */}
      {view === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center">
              <PlusCircle className="mr-3" size={32} /> System Management
            </h2>

            {/* Add Intersection Form */}
            <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center">
                <MapPin className="mr-2" size={24} /> Add New Intersection
              </h3>
              <form onSubmit={handleAddIntersection}>
                <div className="mb-4">
                  <label htmlFor="newIntersectionName" className="block text-gray-300 text-sm font-bold mb-2">
                    Intersection Name:
                  </label>
                  <input
                    type="text"
                    id="newIntersectionName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    value={newIntersectionName}
                    onChange={(e) => setNewIntersectionName(e.target.value)}
                    placeholder="e.g., Central Park Junction"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <PlusCircle className="mr-2" size={20} /> Add Intersection
                </button>
              </form>
            </div>

            {/* Add RSU Form */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold mb-4 text-purple-300 flex items-center">
                <Wifi className="mr-2" size={24} /> Add New RSU (Roadside Unit)
              </h3>
              <form onSubmit={handleAddRSU}>
                <div className="mb-4">
                  <label htmlFor="newRsuNumber" className="block text-gray-300 text-sm font-bold mb-2">
                    RSU Number:
                  </label>
                  <input
                    type="number"
                    id="newRsuNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    value={newRsuNumber}
                    onChange={(e) => setNewRsuNumber(e.target.value)}
                    placeholder="e.g., 3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newRsuIntersectionId" className="block text-gray-300 text-sm font-bold mb-2">
                    Associated Intersection ID:
                  </label>
                  <select
                    id="newRsuIntersectionId"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    value={newRsuIntersectionId}
                    onChange={(e) => setNewRsuIntersectionId(e.target.value)}
                    required
                  >
                    <option value="">Select Intersection</option>
                    {intersections.map(int => (
                      <option key={int.id} value={int.id}>{int.name} ({int.id})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="newRsuInterconnectedIds" className="block text-gray-300 text-sm font-bold mb-2">
                    Interconnected RSU IDs (comma-separated):
                  </label>
                  <input
                    type="text"
                    id="newRsuInterconnectedIds"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    value={newRsuInterconnectedIds}
                    onChange={(e) => setNewRsuInterconnectedIds(e.target.value)}
                    placeholder="e.g., rsu1, rsu2"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter IDs of existing RSUs this one will communicate with.
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <PlusCircle className="mr-2" size={20} /> Add RSU
                </button>
              </form>
            </div>

            {/* Emergency Priority Control */}
            <div className="p-4 bg-red-900 rounded-lg shadow-inner border border-red-700 mt-8">
              <h3 className="text-xl font-bold mb-4 text-red-300 flex items-center">
                <Siren className="mr-2" size={24} /> Emergency Priority Control
              </h3>
              <div className="mb-4">
                <label htmlFor="emergencyIntersection" className="block text-gray-300 text-sm font-bold mb-2">
                  Select Intersection:
                </label>
                <select
                  id="emergencyIntersection"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  value={emergencyIntersectionId}
                  onChange={(e) => {
                    setEmergencyIntersectionId(e.target.value);
                    setEmergencyLaneId(''); // Reset lane when intersection changes
                  }}
                >
                  <option value="">Select Intersection</option>
                  {intersections.map(int => (
                    <option key={int.id} value={int.id}>{int.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="emergencyLane" className="block text-gray-300 text-sm font-bold mb-2">
                  Select Lane:
                </label>
                <select
                  id="emergencyLane"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  value={emergencyLaneId}
                  onChange={(e) => setEmergencyLaneId(e.target.value)}
                  disabled={!emergencyIntersectionId}
                >
                  <option value="">Select Lane</option>
                  {intersections.find(int => int.id === emergencyIntersectionId)?.lanes.map(lane => (
                    <option key={lane.id} value={lane.id}>{lane.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSimulateEmergency}
                disabled={isEmergencyActive || !emergencyIntersectionId || !emergencyLaneId}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center w-full justify-center"
              >
                <Siren className="mr-2" size={20} /> {isEmergencyActive ? 'Emergency Active...' : 'Simulate Emergency'}
              </button>
            </div>

            {/* Manual Traffic Control */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 mt-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-300 flex items-center">
                <AlertTriangle className="mr-2" size={24} /> Manual Traffic Light Control
              </h3>
              <div className="mb-4">
                <label htmlFor="manualIntersection" className="block text-gray-300 text-sm font-bold mb-2">
                  Select Intersection:
                </label>
                <select
                  id="manualIntersection"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  value={manualOverrideIntersectionId}
                  onChange={(e) => {
                    setManualOverrideIntersectionId(e.target.value);
                    setManualOverrideLaneId('');
                  }}
                >
                  <option value="">Select Intersection</option>
                  {intersections.map(int => (
                    <option key={int.id} value={int.id}>{int.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="manualLane" className="block text-gray-300 text-sm font-bold mb-2">
                  Select Lane:
                </label>
                <select
                  id="manualLane"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  value={manualOverrideLaneId}
                  onChange={(e) => setManualOverrideLaneId(e.target.value)}
                  disabled={!manualOverrideIntersectionId}
                >
                  <option value="">Select Lane</option>
                  {intersections.find(int => int.id === manualOverrideIntersectionId)?.lanes.map(lane => (
                    <option key={lane.id} value={lane.id}>{lane.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="manualState" className="block text-gray-300 text-sm font-bold mb-2">
                  Set Light State:
                </label>
                <select
                  id="manualState"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  value={manualOverrideState}
                  onChange={(e) => setManualOverrideState(e.target.value)}
                >
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSetManualOverride}
                  disabled={manualOverride || !manualOverrideIntersectionId || !manualOverrideLaneId}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center flex-grow"
                >
                  <Lightbulb className="mr-2" size={20} /> Set Manual Override
                </button>
                <button
                  onClick={handleClearManualOverride}
                  disabled={!manualOverride}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center flex-grow"
                >
                  Clear Override
                </button>
              </div>
            </div>

          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-orange-400 flex items-center">
              <Database className="mr-3" size={32} /> System Data & Analytics
            </h2>

            {/* Current Intersections */}
            <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center">
                <MapPin className="mr-2" size={24} /> Current Intersections
              </h3>
              <div className="max-h-60 overflow-y-auto pr-2">
                {intersections.length === 0 ? (
                  <p className="text-gray-400">No intersections added yet.</p>
                ) : (
                  intersections.map(int => (
                    <div key={int.id} className="mb-3 pb-3 border-b border-gray-600 last:border-b-0">
                      <p className="font-semibold text-gray-200">{int.name} (<span className="text-blue-300">{int.id}</span>)</p>
                      <p className="text-sm text-gray-400">RSU: {int.rsuId || 'None'}</p>
                      <p className="text-sm text-gray-400">Lanes: {int.lanes.length}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Current RSUs */}
            <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold mb-4 text-purple-300 flex items-center">
                <Wifi className="mr-2" size={24} /> Current RSUs
              </h3>
              <div className="max-h-60 overflow-y-auto pr-2">
                {rsus.length === 0 ? (
                  <p className="text-gray-400">No RSUs added yet.</p>
                ) : (
                  rsus.map(rsu => (
                    <div key={rsu.id} className="mb-3 pb-3 border-b border-gray-600 last:border-b-0">
                      <p className="font-semibold text-gray-200">RSU {rsu.number} (<span className="text-purple-300">{rsu.id}</span>)</p>
                      <p className="text-sm text-gray-400">Associated Intersection: {intersections.find(int => int.id === rsu.intersectionId)?.name || rsu.intersectionId}</p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <Link className="mr-1" size={14} /> Interconnected: {rsu.interconnectedRSUIds.length > 0 ? rsu.interconnectedRSUIds.join(', ') : 'None'}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <Key className="mr-1" size={14} /> Simulated Key: <span className="text-green-400 text-xs">{rsu.simulatedEncryptedKey}</span>
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <ShieldCheck className="mr-1" size={14} /> Status: <span className={`font-bold ml-1 ${rsu.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>{rsu.status.toUpperCase()}</span>
                      </p>
                      <p className="text-sm text-green-400 italic mt-1">
                        (Data transfer between these RSUs is simulated as encrypted for privacy.)
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Predictive Analytics Dashboard */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 mt-8">
              <h3 className="text-xl font-bold mb-4 text-green-300 flex items-center">
                <TrendingUp className="mr-2" size={24} /> Predictive Analytics Dashboard
              </h3>
              <p className="text-gray-300 mb-2">
                Insights from the ML model to forecast traffic and identify trends.
              </p>
              <div className="mb-2">
                <span className="font-semibold text-gray-200">Next Peak Hour Congestion Forecast:</span>{' '}
                <span className="text-yellow-400 font-bold">{['High', 'Medium', 'Low'][getRandomInt(0,2)]}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-200">Accident Probability Hotspots:</span>{' '}
                <span className="text-red-400 font-bold">{['Main St & 1st Ave', 'Oak Ave & 2nd St', 'River Rd & Bridge'][getRandomInt(0,2)]}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-200">Event-Based Traffic Adjustments:</span>{' '}
                <span className="text-blue-300">Stadium event detected, adjusting routes for 6 PM.</span>
              </div>
            </div>

            {/* Vehicle Registry */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 mt-8">
              <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center">
                <Car className="mr-2" size={24} /> Vehicle Registry (Last Seen)
              </h3>
              <p className="text-gray-300 mb-2">
                Tracked vehicles and their last known location. (Showing last 5 unique vehicles)
              </p>
              <div className="max-h-60 overflow-y-auto pr-2">
                {Object.keys(vehicleRegistry.current).length === 0 ? (
                  <p className="text-gray-400">No vehicles tracked yet.</p>
                ) : (
                  Object.entries(vehicleRegistry.current).slice(-5).reverse().map(([plate, data]) => (
                    <div key={plate} className="mb-2 pb-2 border-b border-gray-600 last:border-b-0 text-sm">
                      <p className="font-semibold text-gray-200">Plate: <span className="text-cyan-300">{plate}</span></p>
                      <p className="text-gray-400">Type: {data.type}, Last Seen: {intersections.find(int => int.rsuId === data.lastSeenRSU)?.name || data.lastSeenRSU} at {new Date(data.lastSeenTime).toLocaleTimeString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Simulated Historical Data */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-inner border border-gray-600 mt-8">
              <h3 className="text-xl font-bold mb-4 text-red-300 flex items-center">
                <Cloud className="mr-2" size={24} /> Simulated Historical Traffic Data
              </h3>
              <p className="text-gray-300 mb-2">
                This data represents the accumulated traffic information used to train the predictive models.
                (Showing last 10 entries for brevity)
              </p>
              <div className="max-h-60 overflow-y-auto pr-2">
                {historicalTrafficData.current.length === 0 ? (
                  <p className="text-gray-400">No historical data collected yet.</p>
                ) : (
                  historicalTrafficData.current.slice(-10).reverse().map((data, index) => (
                    <div key={index} className="mb-3 pb-3 border-b border-gray-600 last:border-b-0">
                      <p className="text-sm text-gray-400">
                        <History className="inline-block mr-2" size={16} />
                        <span className="font-medium">Time:</span> {new Date(data.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Intersection:</span> {data.intersectionName}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Total Vehicles:</span> {data.totalVehicles}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Congestion:</span> {data.congestionLevel}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Admin Camera View Section */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mt-6">
            <h2 className="text-3xl font-bold mb-6 text-orange-400 flex items-center">
              <Camera className="mr-3" size={32} /> Intersection Camera Live View
            </h2>
            <div className="mb-4">
              <label htmlFor="cameraIntersectionSelect" className="block text-gray-300 text-sm font-bold mb-2">
                Select Intersection Camera:
              </label>
              <select
                id="cameraIntersectionSelect"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                value={selectedCameraIntersectionId}
                onChange={(e) => setSelectedCameraIntersectionId(e.target.value)}
              >
                <option value="">Select an Intersection</option>
                {intersections.map(int => (
                  <option key={int.id} value={int.id}>{int.name}</option>
                ))}
              </select>
            </div>
            <CameraView intersection={intersections.find(int => int.id === selectedCameraIntersectionId)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
