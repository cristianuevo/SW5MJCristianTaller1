import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, SafeAreaView, StyleSheet, Image, ScrollView, Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DateTimePicker from '@react-native-community/datetimepicker';


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Pantalla 1" }}
        />
        <Stack.Screen
          name="Registrer"
          component={Registrer}
          options={{ title: "Pantalla 2" }}
        />
        <Stack.Screen
          name="Novelties"
          component={Novelties}
          options={{ title: "Pantalla 3" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail("");
    setPassword("");
    setErrorText("");
    setIsLoggedIn(false);
  };

  const handleAuthentication = () => {
    if (!email || !password) {
      setErrorText("Por favor, completa todos los campos.");
      return;
    }

    if (isLoginView) {
      const foundUser = registeredUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        setIsLoggedIn(true);
        setErrorText("");
        navigation.navigate('Registrer');
      } else {
        setErrorText(
          "Usuario o contraseña incorrectos. Por favor, verifica tus credenciales o regístrate."
        );
      }
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        setErrorText("La contraseña no cumple con los requisitos.");
        return;
      }

      const newUser = { email, password };
      console.log("Registrando usuario:", newUser);

      setRegisteredUsers((prevUsers) => [...prevUsers, newUser]);

      setEmail("");
      setPassword("");
      setErrorText("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>
          {isLoginView ? "Minería 4K" : "Minería 4K"}
        </Text>
        <Image
          source={require("./assets/mina.png")}
          style={{
            width: 200,
            height: 200,
            alignSelf: "center",
            margin: "auto",
            marginBottom: 20,
          }}
        />
        <Text style={styles.headerText}>
          {isLoginView ? "Iniciar Sesión" : "Registrarme"}
        </Text>
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable onPress={handleAuthentication} style={styles.authButton}>
          <Text style={styles.buttonText}>
            {isLoginView ? "Iniciar sesión" : "Registrarme"}
          </Text>
        </Pressable>
        {errorText !== "" && <Text style={styles.errorText}>{errorText}</Text>}
        {isLoggedIn && (
          <Text style={styles.welcomeText}>¡Bienvenido a la aplicación!</Text>
        )}
        <Pressable onPress={handleToggleView}>
          <Text style={styles.toggleText}>
            {isLoginView
              ? "Regístrate"
              : "Inicia Sesión"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Registrer({ navigation }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [startWorkTime, setStartWorkTime] = useState([]);
  const [endWorkTime, setEndWorkTime] = useState([]);
  const [workRecords, setWorkRecords] = useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const registerStartTime = () => {
    if (workRecords.length >= 10) {
      Alert.alert(
        "Máximo de Registros",
        "Solo se pueden cargar máximo 10 registros."
      );
      return;
    }
    const currentTime = new Date();
    const newRecord = {
      date: selectedDate.toDateString(),
      startTime: `${currentTime.getHours()}:${currentTime.getMinutes()} ${selectedPeriod}`,
    };
    setStartWorkTime([...startWorkTime, newRecord]);
  };

  const registerEndTime = () => {
    if (workRecords.length >= 10) {
      Alert.alert(
        "Máximo de Registros",
        "Solo se pueden cargar máximo 10 registros."
      );
      return;
    }
    const currentTime = new Date();
    const lastRecord = startWorkTime[startWorkTime.length - 1];
    const updatedRecord = {
      ...lastRecord,
      endTime: `${currentTime.getHours()}:${currentTime.getMinutes()} ${selectedPeriod}`,
    };
    setEndWorkTime([...endWorkTime, updatedRecord]);
    calculateTotalHours(updatedRecord);
  };

  const calculateTotalHours = (record) => {
    const startHours = record.startTime.split(":")[0];
    const startMinutes = record.startTime.split(":")[1].split(" ")[0];
    const startPeriod = record.startTime.split(" ")[1];
    const endHours = record.endTime.split(":")[0];
    const endMinutes = record.endTime.split(":")[1].split(" ")[0];
    const endPeriod = record.endTime.split(" ")[1];

    let totalHours = parseInt(endHours) - parseInt(startHours);
    if (endPeriod !== startPeriod) {
      totalHours += 12;
    }
    const totalMinutes = parseInt(endMinutes) - parseInt(startMinutes);

    record.totalHours = `${totalHours}h ${totalMinutes}m`;
    setWorkRecords([...workRecords, record]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Registro de Horas</Text>

        <Pressable style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonText}>Seleccionar Fecha</Text>
        </Pressable>

        <View style={styles.periodContainer}>
          <Pressable
            style={[
              styles.periodButton,
              selectedPeriod === 'AM' && styles.selectedButton,
            ]}
            onPress={() => setSelectedPeriod('AM')}
          >
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === 'AM' && styles.selectedButtonText,
              ]}
            >
              AM
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.periodButton,
              selectedPeriod === 'PM' && styles.selectedButton,
            ]}
            onPress={() => setSelectedPeriod('PM')}
          >
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === 'PM' && styles.selectedButtonText,
              ]}
            >
              PM
            </Text>
          </Pressable>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Pressable
          style={[styles.button, styles.registerButton]}
          onPress={registerStartTime}
        >
          <Text style={styles.buttonText}>Registrar Hora</Text>
        </Pressable>

        {startWorkTime.length > 0 && !endWorkTime[startWorkTime.length - 1]?.endTime && (
          <Pressable
            style={[styles.button, styles.registerButton]}
            onPress={registerEndTime}
          >
            <Text style={styles.buttonText}>Hora de Salida</Text>
          </Pressable>
        )}

        <Text style={styles.title}>Consultar Horas</Text>

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {workRecords.slice(0, 10).map((record, index) => (
            <View key={index} style={styles.recordItem}>
              <Text>Hora Actual: {record.date}</Text>
              <View style={styles.hourBox}>
                <Text>Hora Inicial:</Text>
                <Text>{record.startTime}</Text>
              </View>
              {record.endTime && (
                <View style={styles.hourBox}>
                  <Text>Hora Final:</Text>
                  <Text>{record.endTime}</Text>
                </View>
              )}
              {record.totalHours && (
                <View style={styles.hourBox}>
                  <Text>Total Horas:</Text>
                  <Text>{record.totalHours}</Text>
                </View>
              )}
            </View>

          ))}
          <Text style={styles.title}>Novedades</Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Novelties')}>
            <Text style={styles.buttonText}>Registrar Novedades</Text>
          </Pressable>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>

  )
}



function Novelties({ navigation }) {

  const [incapacidad, setIncapacidad] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [licencias, setLicencias] = useState([]);
  const [vacaciones, setVacaciones] = useState([]);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedVacationDays, setSelectedVacationDays] = useState(1);



  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };



  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setSelectedStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setSelectedEndDate(selectedDate);
    }
  };

  const registrarIncapacidad = () => {
    const nuevaIncapacidad = { inicio: selectedStartDate, fin: selectedEndDate };
    setIncapacidad([...incapacidad, nuevaIncapacidad]);
    setSelectedStartDate(new Date());
    setSelectedEndDate(new Date());
  };

  const registrarLicencia = () => {
    if (selectedHours <= 8) {
      const nuevaLicencia = { horas: selectedHours };
      setLicencias([...licencias, nuevaLicencia]);
    } else {
      const nuevaVacacion = { horas: selectedHours };
      setVacaciones([...vacaciones, nuevaVacacion]);
    }
    setSelectedHours(0);
  };

  const hideStartDatePickerModal = () => {
    setShowStartDatePicker(false);
  };

  const hideEndDatePickerModal = () => {
    setShowEndDatePicker(false);
  };


  const registrarVacaciones = () => {
    if (selectedVacationDays >= 1 && selectedVacationDays <= 15) {
      const nuevaVacacion = { dias: selectedVacationDays };
      setVacaciones([...vacaciones, nuevaVacacion]);
    }
    setSelectedVacationDays(1);
  };


  return (


    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registro de Incapacidades</Text>
          <Pressable style={styles.button} onPress={showStartDatePickerModal}>
            <Text style={styles.buttonText}>Seleccionar Fecha de Inicio</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={showEndDatePickerModal}>
            <Text style={styles.buttonText}>Seleccionar Fecha de Fin</Text>
          </Pressable>
          {showStartDatePicker && (
            <DateTimePicker
              value={selectedStartDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={selectedEndDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          <Pressable style={styles.button} onPress={registrarIncapacidad}>
            <Text style={styles.buttonText}>Registrar Incapacidad</Text>
          </Pressable>
          <Text style={styles.incapacidadList}>
            Incapacidades Registradas:
            {incapacidad.map((item, index) => (
              <Text key={index}>
                {'\n'}Inicio: {item.inicio.toDateString()} - Fin: {item.fin.toDateString()}
              </Text>
            ))}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registro de Licencias</Text>
          <TextInput
            style={styles.input}
            placeholder="Horas de Licencia"
            keyboardType="numeric"
            value={selectedHours.toString()}
            onChangeText={(text) => setSelectedHours(Number(text))}
          />
          <Pressable style={styles.button} onPress={registrarLicencia}>
            <Text style={styles.buttonText}>Registrar Licencia</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Licencias Registradas</Text>
          <Text style={styles.registrosText}>
            {licencias.map((licencia, index) => (
              <Text key={index}>{`\nHoras: ${licencia.horas}`}</Text>
            ))}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registro de Vacaciones</Text>
          <TextInput
            style={styles.input}
            placeholder="Días de Vacaciones"
            keyboardType="numeric"
            value={selectedVacationDays.toString()}
            onChangeText={(text) => setSelectedVacationDays(Number(text))}
          />
          <Pressable style={styles.button} onPress={registrarVacaciones}>
            <Text style={styles.buttonText}>Registrar Vacaciones</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vacaciones Registradas</Text>
          <Text style={styles.registrosText}>
            {vacaciones.map((vacacion, index) => (
              <Text key={index}>{`\nDías: ${vacacion.dias}`}</Text>
            ))}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>


  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",


  },
  safeContainer: {
    flex: 1,
    backgroundColor: "white",


  },
  button: {
    paddingVertical: 12,
    backgroundColor: "#3498db",
    borderRadius: 150,
    width: "50%",
    marginBottom: 15,

  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",

  },
  selectedButton: {
    backgroundColor: "#2ecc71",



  },
  selectedButtonText: {
    color: "#333",



  },
  registerButton: {
    backgroundColor: "#e74c3c",


  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",


  },
  recordItem: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "90%",


  },
  hourBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,


  },
  content: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,

  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",


  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,

  },
  authButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",

  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",

  },
  toggleText: {
    marginTop: 10,
    textAlign: "center",
    color: "#007bff",

  },
  safeContainer: {
    flex: 1,
    backgroundColor: "white",

  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: 'center',

  },
  periodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,

  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#27ae60",
    borderRadius: 5,
    marginRight: 40,
    marginLeft: 40,

  },
  selectedButton: {
    backgroundColor: "#2ecc71",

  },
  selectedButtonText: {
    color: "#333",

  },
  registerButton: {
    backgroundColor: "#e74c3c",

  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",

  },
  recordItem: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "90%",

  },
  hourBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,

  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",

  },
  hourBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#27ae60',
  },
  selectedButtonText: {
    fontWeight: 'bold',
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 8,
  },
  registerButton: {
    backgroundColor: '#e67e22',
  },
  scrollViewContainer: {
    paddingTop: 10,
  },
  recordItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  hourBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },


  section: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',

  },
  incapacidadList: {
    marginTop: 10,
    fontSize: 16,
  },

  input: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,


  },
  registrosText: {
    marginTop: 10,
    fontSize: 16,
  },

});
