import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useReducer, useCallback } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { HTMLElementModel, HTMLContentModel, TRenderEngineProvider, RenderHTMLConfigProvider, RenderHTMLSource, domNodeToHTMLString, defaultSystemFonts } from 'react-native-render-html';

var DEFAULT_FONT_SIZE = 18;
// var DATA = `
// {
//   "questions": [
//     {
//       "chapitre": "calculs",
//       "titre": "Simplification de fraction",
//       "question": "Quelle est la forme simplifiée de la fraction <math>\\frac{48}{64}</math> ?",
//       "reponses": [
//         "<math>\\frac{3}{4}</math>",
//         "<math>\\frac{4}{5}</math>",
//         "<math>\\frac{1}{2}</math>",
//         "<math>\\frac{2}{3}</math>"
//       ],
//       "solution": "La forme simplifiée de <math>\\frac{48}{64}</math> est <math>\\frac{3}{4}</math>.",
//       "type": "qcm",
//       "difficulte": 1
//     },
//     {
//       "chapitre": "calculs",
//       "titre": "Développement d'expression",
//       "question": "Quel est le résultat du développement de <math>(x - 2)(x + 3)</math> ?",
//       "reponses": [
//         "<math>x^2 + x - 6</math>",
//         "<math>x^2 - x - 6</math>",
//         "<math>x^2 + 5x - 6</math>",
//         "<math>x^2 - 5x + 6</math>"
//       ],
//       "solution": "Le résultat du développement de <math>(x - 2)(x + 3)</math> est <math>x^2 + x - 6</math>.",
//       "type": "qcm",
//       "difficulte": 2
//     },
//     {
//       "chapitre": "calculs",
//       "titre": "Factorisation",
//       "question": "Quelle est la factorisation de <math>x^2 - 5x + 6</math> ?",
//       "reponses": [
//         "<math>(x - 2)(x - 3)</math>",
//         "<math>(x - 1)(x - 6)</math>",
//         "<math>(x + 2)(x + 3)</math>",
//         "<math>(x + 3)(x - 2)</math>"
//       ],
//       "solution": "La factorisation de <math>x^2 - 5x + 6</math> est <math>(x - 2)(x - 3)</math>.",
//       "type": "qcm",
//       "difficulte": 2
//     },
//     {
//       "chapitre": "calculs",
//       "titre": "Calcul de racine carrée",
//       "question": "Quelle est la valeur de <math>\\sqrt{36}</math> ?",
//       "reponses": [
//         "6",
//         "12",
//         "18",
//         "3"
//       ],
//       "solution": "La valeur de <math>\\sqrt{36}</math> est 6.",
//       "type": "qcm",
//       "difficulte": 1
//     },
//     {
//       "chapitre": "calculs",
//       "titre": "Calcul avec puissances",
//       "question": "Quel est le résultat de <math>2^3 \\times 2^2</math> ?",
//       "reponses": [
//         "16",
//         "32",
//         "8",
//         "64"
//       ],
//       "solution": "Le résultat de <math>2^3 \\times 2^2</math> est 32, car en utilisant la propriété des puissances, on obtient <math>2^{3+2} = 2^5 = 32</math>.",
//       "type": "qcm",
//       "difficulte": 2
//     }
//   ]
// }
// `;
var DATA = {
  "questions": [
    {
      "chapitre": "calculs",
      "titre": "Simplification de fraction",
      "question": "Quelle est la forme simplifiée de \\(\\frac{45}{60}\\)?",
      "reponses": [
        "\\(\\frac{3}{4}\\)",
        "\\(\\frac{2}{3}\\)",
        "\\(\\frac{4}{5}\\)",
        "\\(\\frac{5}{6}\\)"
      ],
      "solution": "\\(\\frac{3}{4}\\) est la forme simplifiée de \\(\\frac{45}{60}\\).",
      "type": "qcm",
      "difficulte": 1
    },
    {
      "chapitre": "calculs",
      "titre": "Développement d'expression",
      "question": "Quel est le résultat du développement de \\((x + 3)(x - 4)\\)?",
      "reponses": [
        "\\(x^2 - x - 12\\)",
        "\\(x^2 + x - 12\\)",
        "\\(x^2 - 7x + 12\\)",
        "\\(x^2 + 7x - 12\\)"
      ],
      "solution": "\\(x^2 - x - 12\\) est le résultat du développement de \\((x + 3)(x - 4)\\).",
      "type": "qcm",
      "difficulte": 2
    },
    {
      "chapitre": "calculs",
      "titre": "Factorisation",
      "question": "Quelle est la factorisation de \\(x^2 + 5x + 6\\)?",
      "reponses": [
        "\\((x + 2)(x + 3)\\)",
        "\\((x - 2)(x - 3)\\)",
        "\\((x + 1)(x + 6)\\)",
        "\\((x - 1)(x - 6)\\)"
      ],
      "solution": "\\((x + 2)(x + 3)\\) est la factorisation de \\(x^2 + 5x + 6\\).",
      "type": "qcm",
      "difficulte": 2
    },
    {
      "chapitre": "calculs",
      "titre": "Calcul de racine carrée",
      "question": "Quelle est la valeur de \\(\\sqrt{49}\\)?",
      "reponses": [
        "7",
        "49",
        "14",
        "21"
      ],
      "solution": "7 est la valeur de \\(\\sqrt{49}\\).",
      "type": "qcm",
      "difficulte": 1
    },
    {
      "chapitre": "calculs",
      "titre": "Calcul avec puissances",
      "question": "Quel est le résultat de \\(3^2 \\times 3^3\\)?",
      "reponses": [
        "\\(3^5\\)",
        "\\(3^6\\)",
        "\\(9\\)",
        "\\(27\\)"
      ],
      "solution": "\\(3^5\\) est le résultat de \\(3^2 \\times 3^3\\), car en utilisant la propriété des puissances, on obtient \\(3^{2+3} = 3^5\\).",
      "type": "qcm",
      "difficulte": 2
    }
  ]};
var DATA = JSON.stringify(DATA);
var QUESTIONS = JSON.parse(DATA);
// ${ QUESTIONS['questions'][0]['question'] }

export const MATH_JAX_PATTERN_INLINE_BLOCK =
  /(?:\${2}|\\\[|\\(begin|end)\{.*?})[^<]*(?:\${2}|\\\]|\\(begin|end)\{.*?})/g;

export const MATH_JAX_PATTERN_INLINE =
  /<\s*\s*.*\s*>*(?:\\\(|\\(begin|end)\{.*?})[^<]*(?:\\\)|\\(begin|end)\{.*?})*<\s*\/\s*.*\s*>/g;

const customHTMLElementModels = {
  math: HTMLElementModel.fromCustomModel({
    tagName: 'math',
    contentModel: HTMLContentModel.block,
  })
};

const BLOCK_PATTERN = /(?:\${1}|\\\[|\\(begin|end)\{.*?})/g;

const systemFonts = [...defaultSystemFonts, 'Mysuperfont']

const renderers = {
  math: MathJaxRenderer,
};

function MathJaxRenderer(props) {
  // Alert.alert('Alert Title', QUESTIONS['questions'][0]['question'], [
  //   {
  //     text: 'Cancel',
  //     onPress: () => console.log('Cancel Pressed'),
  //     style: 'cancel',
  //   },
  //   {text: 'OK', onPress: () => console.log('OK Pressed')},
  // ]);
  // const theme = useThemeContext();
  const { TDefaultRenderer, ...restOfTheProps } = props;
  const {
    tnode: { domNode },
  } = props;
  const html = useMemo(() => domNodeToHTMLString(domNode), [domNode]);

  const isBlock = !!html.match(BLOCK_PATTERN);
  return (
    <MathJaxSvg
      fontSize={DEFAULT_FONT_SIZE}
      // color={theme.colors.para}
      fontCache
      style={StyleSheet.flatten([
        {
          backgroundColor: 'transparent',
          alignItems: 'center',
        },
        isBlock
          ? {
              justifyContent: 'center',
              // marginVertical: calculateFontSize(10),
            }
          : {
              justifyContent: 'flex-start',
              // marginVertical: calculateFontSize(7),
            },
      ])}>
      {html}
    </MathJaxSvg>
  );
};

const Engine = ({ children }) => {
  return (
    <TRenderEngineProvider
      systemFonts={systemFonts}
      customHTMLElementModels={customHTMLElementModels}>
      <RenderHTMLConfigProvider
        renderers={renderers}>
        {children}
      </RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
}

function Calculs() {
  const { width } = useWindowDimensions();
  // const source = {
  //   html: `<math>\\(x^2 + y^2 = r^2\\)</math>`
  // };
  const source = {
    html: `<math>${ QUESTIONS['questions'][0]['question'] }</math>`
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Engine>
        <RenderHTMLSource contentWidth={width} source={source} />
      </Engine>
    </View>
    
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