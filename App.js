import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { HTMLElementModel, HTMLContentModel } from 'react-native-render-html';

var DATA = `
{
  "questions": [
    {
      "chapitre": "calculs",
      "titre": "Simplification de fraction",
      "question": "Quelle est la forme simplifiée de la fraction \\\\frac{48}{64} ?",
      "reponses": ["\\\\frac{3}{4}", "\\\\frac{4}{5}", "\\\\frac{1}{2}", "\\\\frac{2}{3}"],
      "solution": "La forme simplifiée de \\\\frac{48}{64} est \\\\frac{3}{4}.",
      "type": "qcm",
      "difficulte": 1
    },
    {
      "chapitre": "calculs",
      "titre": "Développement d'expression",
      "question": "Quel est le résultat du développement de \\\\(x - 2)(x + 3)\\\\ ?",
      "reponses": ["\\\\x^2 + x - 6", "\\\\x^2 - x - 6", "\\\\x^2 + 5x - 6", "\\\\x^2 - 5x + 6"],
      "solution": "Le résultat du développement de \\\\(x - 2)(x + 3)\\\\ est \\\\x^2 + x - 6.",
      "type": "qcm",
      "difficulte": 2
    },
    {
      "chapitre": "calculs",
      "titre": "Factorisation",
      "question": "Quelle est la factorisation de \\\\x^2 - 5x + 6\\\\ ?",
      "reponses": ["\\\\(x - 2)(x - 3)\\\\", "\\\\(x - 1)(x - 6)\\\\", "\\\\(x + 2)(x + 3)\\\\", "\\\\(x + 3)(x - 2)\\\\"],
      "solution": "La factorisation de \\\\x^2 - 5x + 6\\\\ est \\\\ (x - 2)(x - 3)\\\\.",
      "type": "qcm",
      "difficulte": 2
    },
    {
      "chapitre": "calculs",
      "titre": "Calcul de racine carrée",
      "question": "Quelle est la valeur de \\\\sqrt{36}\\\\ ?",
      "reponses": ["6", "12", "18", "3"],
      "solution": "La valeur de \\\\sqrt{36}\\\\ est 6.",
      "type": "qcm",
      "difficulte": 1
    },
    {
      "chapitre": "calculs",
      "titre": "Calcul avec puissances",
      "question": "Quel est le résultat de \\\\2^3 \\\\times 2^2\\\\ ?",
      "reponses": ["16", "32", "8", "64"],
      "solution": "Le résultat de \\\\2^3 \\\\times 2^2\\\\ est 32, car en utilisant la propriété des puissances, on obtient \\\\2^{3+2} = 2^5 = 32\\\\.",
      "type": "qcm",
      "difficulte": 2
    }
  ]
}
`;

const QUESTIONS = JSON.parse(DATA);
// ${ QUESTIONS['questions'][0]['question'] }

const source = {
  // html: `
  //   ${ QUESTIONS['questions'][0]['question'] }
  // ` 
  html: `
  Test html;;;
  `   
};

export const MATH_JAX_PATTERN_INLINE_BLOCK =
  /(?:\${2}|\\\[|\\(begin|end)\{.*?})[^<]*(?:\${2}|\\\]|\\(begin|end)\{.*?})/g;

export const MATH_JAX_PATTERN_INLINE =
  /<\s*\s*.*\s*>*(?:\\\(|\\(begin|end)\{.*?})[^<]*(?:\\\)|\\(begin|end)\{.*?})*<\s*\/\s*.*\s*>/g;


function Calculs() {
  const { width } = useWindowDimensions();
  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <Text>Calculs</Text>
    // </View>
    <RenderHtml
      contentWidth={width}
      source={source}
    /> 
  );
}

function Derivation() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dérivation Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function ChapterDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Calculs">
      <Drawer.Screen
        name="Calculs"
        component={Calculs}
        options={{ drawerLabel: 'Calculs' }}
      />
      <Drawer.Screen
        name="Dérivation"
        component={Derivation}
        options={{ drawerLabel: 'Dérivation' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <ChapterDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});