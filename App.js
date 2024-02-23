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

//export in front of const
//Matches \[ and others things I don't really use
const MATH_JAX_PATTERN_INLINE_BLOCK =
  /(?:\${2}|\\\[|\\(begin|end)\{.*?})[^<]*(?:\${2}|\\\]|\\(begin|end)\{.*?})/g;

//Matches \( but inside html tags
const MATH_JAX_PATTERN_INLINE_HTML =
  /<\s*\s*.*\s*>*(?:\\\(|\\(begin|end)\{.*?})[^<]*(?:\\\)|\\(begin|end)\{.*?})*<\s*\/\s*.*\s*>/g;

//Matches \( without html tags
const MATH_JAX_PATTERN_INLINE = /(?:\\\(.*?\\\))/gs;
//Old one that doesn't take into account the \ inside the latex itself
// const MATH_JAX_PATTERN_INLINE = /(?:\\\(|\\begin\{.*?\})[^\\]*(?:\\\)|\\end\{.*?\})/g;

const BLOCK_PATTERN = /(?:\${1}|\\\[|\\(begin|end)\{.*?})/g;

const customHTMLElementModels = {
  math: HTMLElementModel.fromCustomModel({
    tagName: 'math',
    contentModel: HTMLContentModel.block,
  })
};

const systemFonts = [...defaultSystemFonts, 'Mysuperfont']

const renderers = {
  math: MathJaxRenderer,
};

function MathJaxRenderer(props) {
  // const theme = useThemeContext();
  const { TDefaultRenderer, ...restOfTheProps } = props;
  const {
    tnode: { domNode },
  } = props;
  const html = useMemo(() => domNodeToHTMLString(domNode), [domNode]);

  // const isBlock = !!html.match(BLOCK_PATTERN);
  const isBlock = !html.match(MATH_JAX_PATTERN_INLINE);
  console.log(isBlock);
  // console.log(html.match(MATH_JAX_PATTERN_INLINE));
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
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              flexShrink: 1
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
  // const source = {
  //   html: `\\(x^2 + y^2 = r^2\\)`
  // };
  // console.log(QUESTIONS['questions'][0]['question']);
  const source = {
    html: `${ QUESTIONS['questions'][0]['question'] }`
  };
  const foundPatterns = source.html.match(MATH_JAX_PATTERN_INLINE);
  console.log("1) "+source.html);
  console.log("2) "+foundPatterns);
  source.html = source.html.replace(MATH_JAX_PATTERN_INLINE, (match) => {
    return `<math>${match}</math>`;
  });
  console.log("3) "+source.html);

  const tagsStyles = {
    math: {
      display: 'inline!important'
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Engine>
        <RenderHTMLSource contentWidth={width} source={source} tagsStyles={tagsStyles} />
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