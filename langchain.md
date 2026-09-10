# 🔗 LangChain Complete Interview Preparation Notes
### 📅 CampusX — "Generative AI using LangChain" Playlist
### 🎯 Interview Ready — All Topics Covered with Code Snippets

---

## 📑 TABLE OF CONTENTS

1. [What is LangChain?](#1-what-is-langchain)
2. [LangChain Architecture & Ecosystem](#2-langchain-architecture--ecosystem)
3. [Models (Chat Models & LLMs)](#3-models-chat-models--llms)
4. [Embedding Models](#4-embedding-models)
5. [Prompt Templates](#5-prompt-templates)
6. [Output Parsers](#6-output-parsers)
7. [Chains](#7-chains)
8. [LCEL — LangChain Expression Language](#8-lcel--langchain-expression-language)
9. [Runnables](#9-runnables)
10. [Memory](#10-memory)
11. [Document Loaders](#11-document-loaders)
12. [Text Splitters](#12-text-splitters)
13. [Vector Stores & Embeddings](#13-vector-stores--embeddings)
14. [Retrievers](#14-retrievers)
15. [RAG — Retrieval Augmented Generation](#15-rag--retrieval-augmented-generation)
16. [Tools](#16-tools)
17. [Agents](#17-agents)
18. [Structured Output](#18-structured-output)
19. [LangSmith (Tracing & Debugging)](#19-langsmith-tracing--debugging)
20. [LangGraph (Advanced Agents)](#20-langgraph-advanced-agents)
21. [Interview Questions & Answers](#21-interview-questions--answers)
22. [Quick Revision Cheat Sheet](#22-quick-revision-cheat-sheet)

---

## 1. What is LangChain?

### 📖 Definition
**LangChain** is an open-source Python (and JavaScript) framework that simplifies building applications powered by Large Language Models (LLMs). It acts as **middleware/orchestration layer** between LLMs and your application logic.

### 🎯 Why LangChain?
- **Problem:** LLMs alone can only take text → return text. They can't access real-time data, databases, APIs, or remember past conversations.
- **Solution:** LangChain provides a **modular, composable architecture** that lets you connect LLMs to external data sources, tools, and memory.

### 🧩 Key Benefits
| Benefit | Description |
|---------|-------------|
| **Unified Interface** | One API to work with OpenAI, Anthropic, Google, HuggingFace, etc. |
| **Modularity** | Swap models, prompts, memory — each component is independent |
| **Composability** | Chain components together like LEGO blocks |
| **Data Awareness** | Connect LLMs to your own data (PDFs, DBs, websites) |
| **Agentic Behavior** | LLMs can use tools and make decisions autonomously |

### 📦 Installation
```bash
pip install langchain
pip install langchain-openai      # For OpenAI models
pip install langchain-community   # Community integrations
pip install langchain-core        # Core abstractions
```

### 🔑 API Key Setup
```python
import os
os.environ["OPENAI_API_KEY"] = "your-api-key-here"

# OR using dotenv
from dotenv import load_dotenv
load_dotenv()  # loads from .env file
```

---

## 2. LangChain Architecture & Ecosystem

### 🏗️ Architecture Overview
```
┌─────────────────────────────────────────────────┐
│                  YOUR APPLICATION                │
├─────────────────────────────────────────────────┤
│                   LangChain                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Models   │ │ Prompts  │ │  Output Parsers  │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Chains   │ │  Memory  │ │     Agents       │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │Retrievers│ │ Vectors  │ │  Doc Loaders     │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────┤
│          LLM Providers (OpenAI, etc.)            │
└─────────────────────────────────────────────────┘
```

### 📦 Package Structure (Modern LangChain)
| Package | Purpose |
|---------|---------|
| `langchain-core` | Base abstractions, interfaces, LCEL |
| `langchain` | Chains, agents, retrieval strategies |
| `langchain-community` | Third-party integrations |
| `langchain-openai` | OpenAI-specific integrations |
| `langchain-google-genai` | Google AI integrations |
| `langsmith` | Tracing, debugging, evaluation |
| `langgraph` | Graph-based agent orchestration |

### 🔄 6 Core Components
1. **Models** — The AI brain (ChatOpenAI, etc.)
2. **Prompts** — Instructions to the model
3. **Chains** — Sequential workflows
4. **Memory** — Conversation history storage
5. **Indexes** — Data loading + retrieval (RAG)
6. **Agents** — Autonomous decision-making

---

## 3. Models (Chat Models & LLMs)

### 📖 Definition
Models are the **core AI components** that generate text. LangChain provides a unified interface to interact with different model providers.

### 🔑 Two Types of Models

#### Type 1: LLMs (Legacy — Text In → Text Out)
```python
from langchain_openai import OpenAI

# LLM: takes a string, returns a string
llm = OpenAI(model="gpt-3.5-turbo-instruct")
result = llm.invoke("What is the capital of France?")
print(result)  # "The capital of France is Paris."
```

#### Type 2: Chat Models (Modern — Messages In → Message Out)
```python
from langchain_openai import ChatOpenAI

# Chat Model: takes messages, returns a message
chat_model = ChatOpenAI(model="gpt-4o-mini")
result = chat_model.invoke("What is the capital of France?")
print(result.content)  # "The capital of France is Paris."
```

### 💡 Chat Models are Preferred Because:
- They understand **roles** (system, human, ai)
- Better at **following instructions**
- Support **multi-turn conversations**
- All modern LLMs are chat models

### 📨 Message Types
```python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="What is Python?"),
    AIMessage(content="Python is a programming language."),
    HumanMessage(content="Tell me more about it.")
]

result = chat_model.invoke(messages)
print(result.content)
```

| Message Type | Role | Purpose |
|-------------|------|---------|
| `SystemMessage` | system | Sets behavior, tone, personality |
| `HumanMessage` | human | User's input/question |
| `AIMessage` | ai | Model's previous responses |

### ⚙️ Model Parameters
```python
chat_model = ChatOpenAI(
    model="gpt-4o-mini",       # Model name
    temperature=0.7,            # Creativity (0=deterministic, 1=creative)
    max_tokens=500,             # Max output length
    timeout=30,                 # Request timeout in seconds
    max_retries=2               # Retry on failure
)
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `temperature` | Controls randomness. 0 = factual, 1 = creative | 0.7 |
| `max_tokens` | Maximum tokens in the output | Model-dependent |
| `model` | Which model to use | Required |
| `top_p` | Nucleus sampling threshold | 1.0 |

### 🔄 Three Ways to Call a Model
```python
# 1. invoke() — Single input, single output
result = chat_model.invoke("Hello!")

# 2. batch() — Multiple inputs, multiple outputs
results = chat_model.batch(["Hello!", "What is AI?", "Tell a joke"])

# 3. stream() — Get output token by token (for real-time UX)
for chunk in chat_model.stream("Write a poem about Python"):
    print(chunk.content, end="", flush=True)
```

### 🌐 Using Different Providers
```python
# OpenAI
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model="gpt-4o")

# Google
from langchain_google_genai import ChatGoogleGenerativeAI
model = ChatGoogleGenerativeAI(model="gemini-pro")

# Anthropic
from langchain_anthropic import ChatAnthropic
model = ChatAnthropic(model="claude-3-sonnet")

# HuggingFace
from langchain_community.llms import HuggingFaceHub
model = HuggingFaceHub(repo_id="google/flan-t5-large")

# Ollama (Local models)
from langchain_community.llms import Ollama
model = Ollama(model="llama2")
```

---

## 4. Embedding Models

### 📖 Definition
**Embedding Models** convert text into **numerical vectors** (lists of floating-point numbers) that capture **semantic meaning**. Similar texts produce similar vectors.

### 🎯 Why Embeddings?
- Computers can't understand text — they need numbers
- Embeddings capture **meaning**, not just keywords
- Enable **semantic search**: "happy" and "joyful" are close in vector space

### 💻 Code Example
```python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Embed a single text
vector = embeddings.embed_query("LangChain is amazing!")
print(len(vector))    # 1536 (dimensions)
print(vector[:5])     # [0.012, -0.034, 0.056, ...]

# Embed multiple texts
texts = ["Hello world", "Machine learning is great", "I love coding"]
vectors = embeddings.embed_documents(texts)
print(len(vectors))   # 3 (one vector per text)
```

### 📊 How Similarity Works
```python
import numpy as np

# Cosine Similarity — how similar are two vectors?
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

vec1 = embeddings.embed_query("I love dogs")
vec2 = embeddings.embed_query("I adore puppies")
vec3 = embeddings.embed_query("The weather is sunny")

print(cosine_similarity(vec1, vec2))  # ~0.92 (very similar!)
print(cosine_similarity(vec1, vec3))  # ~0.45 (not similar)
```

### 🔄 Different Embedding Providers
```python
# OpenAI
from langchain_openai import OpenAIEmbeddings
embed = OpenAIEmbeddings()

# HuggingFace (Free, runs locally)
from langchain_community.embeddings import HuggingFaceEmbeddings
embed = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Google
from langchain_google_genai import GoogleGenerativeAIEmbeddings
embed = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
```

| Method | Description |
|--------|-------------|
| `embed_query(text)` | Embed a single search query |
| `embed_documents(texts)` | Embed a list of documents |

---

## 5. Prompt Templates

### 📖 Definition
**Prompt Templates** are reusable, dynamic structures that format your instructions before sending them to the LLM. Instead of hardcoding prompts, you use **placeholders** (variables) that get filled at runtime.

### 🎯 Why Prompt Templates?
- **Reusability** — Same template, different inputs
- **Consistency** — Uniform formatting across your app
- **Separation of concerns** — Logic vs. prompt content
- **Dynamic** — Variables filled at runtime

### Type 1: PromptTemplate (Simple String Templates)
```python
from langchain_core.prompts import PromptTemplate

# Method 1: Using from_template
template = PromptTemplate.from_template(
    "Tell me a {adjective} joke about {topic}."
)

# Fill in the variables
prompt = template.invoke({"adjective": "funny", "topic": "programming"})
print(prompt.text)
# Output: "Tell me a funny joke about programming."

# Method 2: Explicit definition
template = PromptTemplate(
    template="Translate '{text}' to {language}.",
    input_variables=["text", "language"]
)
```

### Type 2: ChatPromptTemplate (For Chat Models — MOST USED)
```python
from langchain_core.prompts import ChatPromptTemplate

# Using tuples (role, content)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role} who speaks in {style} style."),
    ("human", "{question}")
])

# Invoke with variables
result = prompt.invoke({
    "role": "teacher",
    "style": "simple",
    "question": "What is recursion?"
})
print(result.messages)
# [SystemMessage(content='You are a teacher who speaks in simple style.'),
#  HumanMessage(content='What is recursion?')]
```

### Type 3: MessagesPlaceholder (For Dynamic Message Lists)
```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("chat_history"),     # ← Dynamic slot
    ("human", "{question}")
])

# Pass conversation history at runtime
result = prompt.invoke({
    "chat_history": [
        ("human", "My name is Sahil"),
        ("ai", "Nice to meet you, Sahil!")
    ],
    "question": "What is my name?"
})
```

> **When to use MessagesPlaceholder:**
> - Injecting conversation history (memory)
> - Few-shot examples
> - Any dynamic list of messages

### Type 4: Few-Shot Prompting
```python
from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate
)

# Step 1: Define examples
examples = [
    {"input": "pirate", "output": "Ahoy! Ye be a scallywag, arr!"},
    {"input": "robot", "output": "BEEP BOOP. PROCESSING HUMOR. HA. HA. HA."},
]

# Step 2: Template for each example
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "Tell me a joke as a {input}"),
    ("ai", "{output}")
])

# Step 3: Create few-shot template
few_shot = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=examples
)

# Step 4: Final prompt
final_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a comedian who can imitate any character."),
    few_shot,
    ("human", "Tell me a joke as a {input}")
])

# Use it
chain = final_prompt | chat_model
result = chain.invoke({"input": "scientist"})
```

### 📊 Prompt Template Summary
| Template | Use Case | Import From |
|----------|----------|-------------|
| `PromptTemplate` | Simple string prompts (legacy LLMs) | `langchain_core.prompts` |
| `ChatPromptTemplate` | Chat models (System + Human + AI) | `langchain_core.prompts` |
| `MessagesPlaceholder` | Dynamic message injection | `langchain_core.prompts` |
| `FewShotChatMessagePromptTemplate` | Teaching by examples | `langchain_core.prompts` |

---

## 6. Output Parsers

### 📖 Definition
**Output Parsers** transform raw LLM text output into **structured formats** (JSON, Python objects, lists) for programmatic use. They tell the model HOW to format its response and then parse that response.

### 🔧 How Output Parsers Work (2 Steps):
1. **`get_format_instructions()`** — Generates instructions that you inject into the prompt telling the model how to format output
2. **`parse()`** — Parses the model's output string into the desired structure

---

### Parser 1: StrOutputParser (Simplest)
Extracts plain text content from the model response.
```python
from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()

# Use in a chain
chain = chat_model | parser
result = chain.invoke("What is Python?")
print(type(result))  # <class 'str'>
print(result)         # "Python is a programming language..."
```

---

### Parser 2: JsonOutputParser
Parses the output into a JSON/dictionary object.
```python
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field

# Define the expected structure
class Movie(BaseModel):
    title: str = Field(description="Name of the movie")
    director: str = Field(description="Director of the movie")
    year: int = Field(description="Release year")

parser = JsonOutputParser(pydantic_object=Movie)

prompt = PromptTemplate(
    template="Give me details about a famous movie.\n{format_instructions}",
    input_variables=[],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

chain = prompt | chat_model | parser
result = chain.invoke({})
print(result)
# {'title': 'Inception', 'director': 'Christopher Nolan', 'year': 2010}
```

---

### Parser 3: PydanticOutputParser
Returns a validated Pydantic object (not just a dict).
```python
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description="Person's full name")
    age: int = Field(description="Person's age in years")
    city: str = Field(description="City where they live")

parser = PydanticOutputParser(pydantic_object=Person)

# Get format instructions for the prompt
print(parser.get_format_instructions())
# Outputs JSON schema that the LLM should follow
```

---

### Parser 4: CommaSeparatedListOutputParser
Returns a Python list from comma-separated output.
```python
from langchain.output_parsers import CommaSeparatedListOutputParser

parser = CommaSeparatedListOutputParser()

prompt = PromptTemplate(
    template="List 5 {topic}.\n{format_instructions}",
    input_variables=["topic"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

chain = prompt | chat_model | parser
result = chain.invoke({"topic": "programming languages"})
print(result)  # ['Python', 'JavaScript', 'Java', 'C++', 'Rust']
```

---

### Parser 5: StructuredOutputParser
For extracting multiple specific fields.
```python
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

schemas = [
    ResponseSchema(name="answer", description="The answer to the question"),
    ResponseSchema(name="source", description="Source of the information"),
    ResponseSchema(name="confidence", description="Confidence level: high/medium/low")
]

parser = StructuredOutputParser.from_response_schemas(schemas)

prompt = PromptTemplate(
    template="Answer the question:\n{question}\n{format_instructions}",
    input_variables=["question"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

chain = prompt | chat_model | parser
result = chain.invoke({"question": "Who invented Python?"})
# {'answer': 'Guido van Rossum', 'source': 'Wikipedia', 'confidence': 'high'}
```

### 📊 Output Parser Summary Table
| Parser | Returns | Best For |
|--------|---------|----------|
| `StrOutputParser` | `str` | Plain text, no structure needed |
| `JsonOutputParser` | `dict` | JSON data extraction |
| `PydanticOutputParser` | Pydantic object | Type-safe, validated objects |
| `CommaSeparatedListOutputParser` | `list` | Simple lists |
| `StructuredOutputParser` | `dict` | Multi-field extraction |

---

## 7. Chains

### 📖 Definition
**Chains** are sequences of components where the **output of one step becomes the input of the next**. They allow you to build complex workflows by connecting prompts, models, parsers, and other components.

### 🎯 Why Chains?
- Combine multiple steps into a single pipeline
- Modular and reusable
- Easy to debug (each step is independent)
- Support streaming and async out of the box

### Simple Chain Example (LCEL — Modern Way)
```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Components
prompt = ChatPromptTemplate.from_template("Explain {topic} in simple terms.")
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Chain them together with pipe operator
chain = prompt | model | parser

# Run the chain
result = chain.invoke({"topic": "quantum computing"})
print(result)
```

### 🔄 How the Chain Flows:
```
{"topic": "quantum computing"}
        ↓
  [Prompt Template]  →  "Explain quantum computing in simple terms."
        ↓
  [Chat Model]       →  AIMessage(content="Quantum computing is...")
        ↓
  [StrOutputParser]  →  "Quantum computing is..."
```

### Sequential Chain (Multi-Step)
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Step 1: Generate a topic
prompt1 = ChatPromptTemplate.from_template(
    "Give me a random programming concept in one word."
)

# Step 2: Explain the topic
prompt2 = ChatPromptTemplate.from_template(
    "Explain {concept} in detail for a beginner."
)

# Chain 1: Get the concept
chain1 = prompt1 | model | parser

# Chain 2: Explain the concept
chain2 = (
    {"concept": chain1}    # Output of chain1 feeds into chain2
    | prompt2
    | model
    | parser
)

result = chain2.invoke({})
print(result)
```

### Legacy Chains (Still Important to Know)
```python
# LLMChain (Legacy — but may appear in interviews)
from langchain.chains import LLMChain

chain = LLMChain(llm=model, prompt=prompt)
result = chain.run(topic="AI")

# ConversationChain (Legacy)
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

conversation = ConversationChain(
    llm=model,
    memory=ConversationBufferMemory()
)
conversation.predict(input="Hi!")

# RetrievalQA (Legacy but widely used)
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=model,
    retriever=vectorstore.as_retriever()
)
```

> ⚠️ **Important:** Legacy chains (LLMChain, ConversationChain) are being replaced by **LCEL**. Know both for interviews.

---

## 8. LCEL — LangChain Expression Language

### 📖 Definition
**LCEL (LangChain Expression Language)** is the **modern, declarative way** to compose chains in LangChain. It uses the **pipe operator (`|`)** to connect components, making code readable, modular, and production-ready.

### 🎯 Why LCEL Over Legacy Chains?
| Feature | Legacy Chains | LCEL |
|---------|--------------|------|
| Streaming | ❌ Manual | ✅ Built-in |
| Async | ❌ Manual | ✅ Built-in |
| Parallel Execution | ❌ No | ✅ Yes |
| Batch Processing | ❌ Manual | ✅ Built-in |
| Debugging | ❌ Hard | ✅ Easy with LangSmith |
| Composability | ❌ Limited | ✅ Unlimited nesting |

### 💻 LCEL Syntax
```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("Tell me about {topic}")
model = ChatOpenAI()
parser = StrOutputParser()

# LCEL Chain: prompt → model → parser
chain = prompt | model | parser

# Different ways to run
# 1. Single invocation
result = chain.invoke({"topic": "AI"})

# 2. Streaming (token by token)
for chunk in chain.stream({"topic": "AI"}):
    print(chunk, end="", flush=True)

# 3. Batch processing
results = chain.batch([
    {"topic": "AI"},
    {"topic": "ML"},
    {"topic": "NLP"}
])

# 4. Async invocation
import asyncio
result = asyncio.run(chain.ainvoke({"topic": "AI"}))
```

### 🔧 LCEL with RunnablePassthrough and RunnableLambda
```python
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

# RunnablePassthrough — passes input through unchanged
chain = (
    {"topic": RunnablePassthrough()}
    | prompt
    | model
    | parser
)
result = chain.invoke("Machine Learning")

# RunnableLambda — apply a custom function
def uppercase(text: str) -> str:
    return text.upper()

chain = prompt | model | parser | RunnableLambda(uppercase)
result = chain.invoke({"topic": "AI"})
print(result)  # "ARTIFICIAL INTELLIGENCE IS..."
```

### 🔀 Parallel Execution with RunnableParallel
```python
from langchain_core.runnables import RunnableParallel

# Run multiple chains simultaneously
prompt1 = ChatPromptTemplate.from_template("Write a poem about {topic}")
prompt2 = ChatPromptTemplate.from_template("Write a joke about {topic}")

chain = RunnableParallel(
    poem=prompt1 | model | parser,
    joke=prompt2 | model | parser
)

result = chain.invoke({"topic": "Python"})
print(result["poem"])   # The poem
print(result["joke"])   # The joke
```

---

## 9. Runnables

### 📖 Definition
**Runnables** are the fundamental building blocks of LCEL. Any component that implements the **Runnable Protocol** can be piped together. All LangChain components (models, prompts, parsers, retrievers) are Runnables.

### 🔑 The Runnable Protocol
Every Runnable must implement these methods:
| Method | Description |
|--------|-------------|
| `invoke(input)` | Run on a single input |
| `batch(inputs)` | Run on a list of inputs |
| `stream(input)` | Stream output chunks |
| `ainvoke(input)` | Async invoke |
| `abatch(inputs)` | Async batch |
| `astream(input)` | Async stream |

### 💻 Key Runnable Types

```python
from langchain_core.runnables import (
    RunnablePassthrough,    # Pass input unchanged
    RunnableLambda,         # Custom function wrapper
    RunnableParallel,       # Run multiple branches in parallel
    RunnableSequence,       # Sequential execution (created by |)
)

# 1. RunnablePassthrough
chain = RunnablePassthrough() | model
# Input passes directly to the model

# 2. RunnableLambda — wrap any Python function
def word_count(text: str) -> str:
    return f"Word count: {len(text.split())}"

chain = prompt | model | parser | RunnableLambda(word_count)

# 3. RunnableParallel — run branches simultaneously
parallel = RunnableParallel(
    upper=RunnableLambda(lambda x: x.upper()),
    lower=RunnableLambda(lambda x: x.lower()),
    length=RunnableLambda(lambda x: len(x))
)
result = parallel.invoke("Hello World")
# {'upper': 'HELLO WORLD', 'lower': 'hello world', 'length': 11}
```

### 🔗 Chaining with `.pipe()`
```python
# These two are equivalent:
chain1 = prompt | model | parser
chain2 = prompt.pipe(model).pipe(parser)
```

### ⚙️ Configuring Runnables
```python
# .bind() — attach default arguments
model_with_temp = model.bind(temperature=0)
chain = prompt | model_with_temp | parser

# .with_config() — set runtime configuration
chain = prompt | model.with_config({"max_tokens": 100}) | parser

# .with_retry() — automatic retries on failure
chain = prompt | model.with_retry(stop_after_attempt=3) | parser

# .with_fallbacks() — fallback to another model on failure
from langchain_anthropic import ChatAnthropic
fallback_model = ChatAnthropic(model="claude-3-haiku")
resilient_model = model.with_fallbacks([fallback_model])
chain = prompt | resilient_model | parser
```

---

## 10. Memory

### 📖 Definition
**Memory** allows LangChain applications to **remember past conversations**. Without memory, every call to the LLM is stateless — it doesn't know what was said before.

### 🎯 Why Memory?
- LLMs are **stateless** by default (no memory between calls)
- Users expect **context** in conversations
- Memory stores previous exchanges and injects them into new prompts

---

### Memory Type 1: ConversationBufferMemory
Stores the **entire** conversation history. Simple but uses many tokens.

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
memory = ConversationBufferMemory()

conversation = ConversationChain(llm=llm, memory=memory)

# Turn 1
conversation.predict(input="Hi, my name is Sahil!")
# "Hello Sahil! How can I help you?"

# Turn 2 — it remembers!
conversation.predict(input="What is my name?")
# "Your name is Sahil!"

# View stored memory
print(memory.load_memory_variables({}))
# {'history': 'Human: Hi, my name is Sahil!\nAI: Hello Sahil!...'}
```

**Best for:** Short conversations needing perfect recall
**Drawback:** Token usage grows with every message

---

### Memory Type 2: ConversationBufferWindowMemory
Keeps only the **last K interactions** (sliding window).

```python
from langchain.memory import ConversationBufferWindowMemory

# Only remember last 3 exchanges
memory = ConversationBufferWindowMemory(k=3)

conversation = ConversationChain(llm=llm, memory=memory)

conversation.predict(input="Message 1")  # Stored
conversation.predict(input="Message 2")  # Stored
conversation.predict(input="Message 3")  # Stored
conversation.predict(input="Message 4")  # Message 1 is dropped!
```

**Best for:** Keeping recent context without high token cost
**Drawback:** Loses older conversation info

---

### Memory Type 3: ConversationSummaryMemory
Uses an LLM to **summarize** the conversation progressively.

```python
from langchain.memory import ConversationSummaryMemory

memory = ConversationSummaryMemory(llm=llm)

conversation = ConversationChain(llm=llm, memory=memory)

conversation.predict(input="I'm learning about LangChain for my interview.")
conversation.predict(input="The interview is in 3 days.")
conversation.predict(input="I need to know about RAG and agents.")

# Memory stores a summary instead of full text:
print(memory.load_memory_variables({}))
# {'history': 'The human is preparing for an interview in 3 days,
#  studying LangChain, specifically RAG and agents.'}
```

**Best for:** Long conversations where gist matters more than exact words
**Drawback:** May lose specific details; extra LLM calls for summarization

---

### Memory Type 4: ConversationSummaryBufferMemory
**Hybrid** — stores recent messages fully + summarizes older ones.

```python
from langchain.memory import ConversationSummaryBufferMemory

memory = ConversationSummaryBufferMemory(
    llm=llm,
    max_token_limit=300  # Summarize when history exceeds 300 tokens
)
```

---

### 🆕 Modern Memory (LCEL-Based)
```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

# In-memory store for sessions
store = {}

def get_session_history(session_id):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

chain = prompt | ChatOpenAI()

# Wrap with message history
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

# Use with session ID
config = {"configurable": {"session_id": "user_123"}}

result = chain_with_history.invoke(
    {"input": "My name is Sahil"},
    config=config
)

result = chain_with_history.invoke(
    {"input": "What is my name?"},
    config=config
)
# "Your name is Sahil!"
```

### 📊 Memory Comparison Table
| Memory Type | Stores | Token Usage | Best For |
|-------------|--------|-------------|----------|
| `BufferMemory` | Everything | High (grows) | Short chats |
| `WindowMemory` | Last K turns | Fixed | Medium chats |
| `SummaryMemory` | LLM summary | Low | Long chats |
| `SummaryBufferMemory` | Recent + Summary | Medium | Best balance |
| `RunnableWithMessageHistory` | Session-based | Flexible | Modern LCEL apps |

---

## 11. Document Loaders

### 📖 Definition
**Document Loaders** import data from various sources (PDFs, websites, databases, CSVs) into LangChain's standard **`Document`** format, which has two fields:
- `page_content` — The text content
- `metadata` — Source info (filename, page number, etc.)

### 💻 Common Document Loaders

```python
# 1. TextLoader — Plain text files
from langchain_community.document_loaders import TextLoader
loader = TextLoader("notes.txt")
docs = loader.load()

# 2. PyPDFLoader — PDF files
from langchain_community.document_loaders import PyPDFLoader
loader = PyPDFLoader("resume.pdf")
docs = loader.load()  # Each page = one Document

# 3. CSVLoader — CSV files
from langchain_community.document_loaders import CSVLoader
loader = CSVLoader("data.csv")
docs = loader.load()  # Each row = one Document

# 4. WebBaseLoader — Web pages
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://example.com/article")
docs = loader.load()

# 5. DirectoryLoader — All files in a folder
from langchain_community.document_loaders import DirectoryLoader
loader = DirectoryLoader("./documents/", glob="**/*.txt")
docs = loader.load()

# 6. WikipediaLoader — Wikipedia articles
from langchain_community.document_loaders import WikipediaLoader
loader = WikipediaLoader(query="LangChain", load_max_docs=3)
docs = loader.load()

# 7. YouTubeLoader — YouTube transcripts
from langchain_community.document_loaders import YoutubeLoader
loader = YoutubeLoader.from_youtube_url("https://youtube.com/watch?v=...")
docs = loader.load()
```

### 📄 Document Object Structure
```python
doc = docs[0]
print(doc.page_content)  # "LangChain is a framework..."
print(doc.metadata)       # {'source': 'notes.txt', 'page': 0}
```

### 📊 Loader Summary
| Loader | Source | Install |
|--------|--------|---------|
| `TextLoader` | `.txt` files | Built-in |
| `PyPDFLoader` | `.pdf` files | `pip install pypdf` |
| `CSVLoader` | `.csv` files | Built-in |
| `WebBaseLoader` | Web pages | `pip install beautifulsoup4` |
| `DirectoryLoader` | Entire folders | Built-in |
| `WikipediaLoader` | Wikipedia | `pip install wikipedia` |
| `Docx2txtLoader` | Word `.docx` | `pip install docx2txt` |
| `UnstructuredExcelLoader` | Excel files | `pip install unstructured` |

---

## 12. Text Splitters

### 📖 Definition
**Text Splitters** break large documents into smaller, manageable **chunks** that fit within the LLM's context window. This is critical because LLMs have a maximum token limit.

### 🎯 Why Split Text?
- LLMs can't process very long documents (token limits)
- Smaller chunks = more precise retrieval in RAG
- Better embeddings with focused content

### 🔑 Key Parameters
| Parameter | Description |
|-----------|-------------|
| `chunk_size` | Maximum size of each chunk (in characters) |
| `chunk_overlap` | Number of overlapping characters between chunks (preserves context) |

### 💻 Text Splitter Types

```python
# 1. RecursiveCharacterTextSplitter (MOST RECOMMENDED)
# Tries to split on: "\n\n" → "\n" → " " → "" (progressively)
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # Max characters per chunk
    chunk_overlap=50,      # Overlap between chunks
    separators=["\n\n", "\n", " ", ""]  # Default order
)

text = "Your very long document text here..."
chunks = splitter.split_text(text)

# Or split Document objects directly
docs = loader.load()
split_docs = splitter.split_documents(docs)
```

```python
# 2. CharacterTextSplitter — Splits on a single separator
from langchain_text_splitters import CharacterTextSplitter

splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_text(text)
```

```python
# 3. TokenTextSplitter — Splits based on token count (not characters)
from langchain_text_splitters import TokenTextSplitter

splitter = TokenTextSplitter(
    chunk_size=100,     # 100 tokens per chunk
    chunk_overlap=20
)
chunks = splitter.split_text(text)
```

```python
# 4. Language-specific splitter (for code)
from langchain_text_splitters import Language, RecursiveCharacterTextSplitter

python_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON,
    chunk_size=500,
    chunk_overlap=50
)

code = """
def hello():
    print("Hello World!")

class MyClass:
    def __init__(self):
        self.value = 42
"""

chunks = python_splitter.split_text(code)
```

### 📊 Chunking Strategy Guide
| Splitter | Best For | How It Works |
|----------|----------|-------------|
| `RecursiveCharacterTextSplitter` | General text (BEST DEFAULT) | Tries multiple separators |
| `CharacterTextSplitter` | Simple splitting | Single separator |
| `TokenTextSplitter` | Token-aware splitting | Counts tokens, not chars |
| `RecursiveCharacterTextSplitter.from_language` | Source code | Language-specific separators |

### 💡 Chunk Size Tips
- **Too small** → loses context, retrieval returns incomplete info
- **Too large** → poor embedding quality, wastes tokens
- **Sweet spot:** 500–1000 characters with 50–100 overlap

---

## 13. Vector Stores & Embeddings

### 📖 Definition
**Vector Stores** are specialized databases that store **embedding vectors** and enable **similarity search**. When you ask a question, the system:
1. Converts your question to a vector
2. Finds the most similar vectors in the store
3. Returns the corresponding text chunks

### 🔄 The Pipeline
```
Documents → Split → Embed → Store in Vector DB → Query → Retrieve
```

### 💻 Popular Vector Stores

#### FAISS (Facebook AI Similarity Search) — Local, Fast
```python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()

# Create from documents
vectorstore = FAISS.from_documents(split_docs, embeddings)

# Or create from texts
texts = ["LangChain is great", "Python is amazing", "AI is the future"]
vectorstore = FAISS.from_texts(texts, embeddings)

# Search
results = vectorstore.similarity_search("What is LangChain?", k=3)
for doc in results:
    print(doc.page_content)

# Search with scores
results = vectorstore.similarity_search_with_score("What is LangChain?", k=3)
for doc, score in results:
    print(f"Score: {score:.4f} | {doc.page_content}")

# Save and Load
vectorstore.save_local("faiss_index")
loaded_store = FAISS.load_local("faiss_index", embeddings,
                                allow_dangerous_deserialization=True)
```

#### Chroma — Popular, Easy to Use
```python
from langchain_community.vectorstores import Chroma

# Create
vectorstore = Chroma.from_documents(
    documents=split_docs,
    embedding=embeddings,
    persist_directory="./chroma_db"  # Save to disk
)

# Search
results = vectorstore.similarity_search("query", k=5)
```

#### Pinecone — Cloud-Based, Production-Ready
```python
from langchain_pinecone import PineconeVectorStore

vectorstore = PineconeVectorStore.from_documents(
    documents=split_docs,
    embedding=embeddings,
    index_name="my-index"
)
```

### 📊 Vector Store Comparison
| Store | Type | Best For | Pros |
|-------|------|----------|------|
| **FAISS** | Local | Prototyping, small datasets | Fast, no server needed |
| **Chroma** | Local/Server | Medium projects | Easy API, persistent |
| **Pinecone** | Cloud | Production | Scalable, managed |
| **Weaviate** | Cloud/Self-hosted | Enterprise | Rich filtering |
| **Milvus** | Self-hosted | Large-scale | High performance |

---

## 14. Retrievers

### 📖 Definition
**Retrievers** are interfaces that return relevant documents given a query. A vector store can be converted to a retriever, but retrievers can also come from other sources.

### 💻 Basic Retriever from Vector Store
```python
# Convert vectorstore to retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",        # or "mmr" or "similarity_score_threshold"
    search_kwargs={"k": 5}           # Return top 5 results
)

# Use the retriever
docs = retriever.invoke("What is LangChain?")
for doc in docs:
    print(doc.page_content)
```

### 🔑 Search Types
```python
# 1. Similarity Search (default) — Most similar documents
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

# 2. MMR (Maximum Marginal Relevance) — Similar but diverse results
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20}  # Fetch 20, pick 5 diverse
)

# 3. Score Threshold — Only above a similarity score
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.7}
)
```

### 🧩 Advanced Retrievers
```python
# MultiQueryRetriever — Generates multiple queries for better retrieval
from langchain.retrievers.multi_query import MultiQueryRetriever

retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=ChatOpenAI()
)

# ContextualCompressionRetriever — Compresses retrieved docs
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(ChatOpenAI())
retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever()
)
```

---

## 15. RAG — Retrieval Augmented Generation

### 📖 Definition
**RAG (Retrieval Augmented Generation)** is a technique that enhances LLM responses by first **retrieving relevant information** from external data sources, then **passing that context to the LLM** for generation. It solves the problem of LLMs not knowing about your private data.

### 🎯 Why RAG?
| Problem | RAG Solution |
|---------|-------------|
| LLMs don't know your data | Retrieves your documents |
| LLMs hallucinate facts | Grounds answers in real data |
| LLMs have knowledge cutoffs | Uses up-to-date sources |
| LLMs can't cite sources | Provides source documents |

### 🔄 RAG Pipeline (4 Steps)
```
Step 1: LOAD      → Document Loaders (PDF, Web, CSV...)
Step 2: SPLIT     → Text Splitters (RecursiveCharacterTextSplitter)
Step 3: EMBED     → Embedding Models → Vector Store
Step 4: RETRIEVE  → Retriever → LLM → Answer
```

### 💻 Complete RAG Implementation
```python
# ============ STEP 1: LOAD ============
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("my_document.pdf")
documents = loader.load()
print(f"Loaded {len(documents)} pages")

# ============ STEP 2: SPLIT ============
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100
)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")

# ============ STEP 3: EMBED & STORE ============
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# ============ STEP 4: RETRIEVE & GENERATE ============
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Define the prompt
prompt = ChatPromptTemplate.from_template("""
Answer the question based ONLY on the following context:

Context: {context}

Question: {question}

Answer: Provide a detailed answer based on the context above.
If the context doesn't contain the answer, say "I don't have enough information."
""")

# Create the RAG chain
model = ChatOpenAI(model="gpt-4o-mini")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough()
    }
    | prompt
    | model
    | StrOutputParser()
)

# Ask questions!
answer = rag_chain.invoke("What are the key findings in the document?")
print(answer)
```

### 🔄 RAG Flow Diagram
```
User Question: "What is X?"
        ↓
[Embed Question] → Vector(question)
        ↓
[Search Vector Store] → Find similar chunks
        ↓
[Retrieved Chunks] → "X is defined as...", "X was created by..."
        ↓
[Inject into Prompt] → "Given context: {chunks}, answer: What is X?"
        ↓
[LLM Generates Answer] → "X is ... (based on your documents)"
```

### 🔧 RAG with Conversation History
```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain, create_history_aware_retriever

# Step 1: History-aware retriever
contextualize_prompt = ChatPromptTemplate.from_messages([
    ("system", "Given chat history, reformulate the latest question to be standalone."),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
])

history_aware_retriever = create_history_aware_retriever(
    llm=model,
    retriever=retriever,
    prompt=contextualize_prompt
)

# Step 2: QA chain
qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer based on context:\n\n{context}"),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
])

question_answer_chain = create_stuff_documents_chain(model, qa_prompt)

# Step 3: Full RAG chain with history
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# Use it
chat_history = []
result = rag_chain.invoke({
    "input": "What is LangChain?",
    "chat_history": chat_history
})
print(result["answer"])
```

---

## 16. Tools

### 📖 Definition
**Tools** are functions or APIs that an LLM can **invoke** to perform real-world actions — like searching the web, running calculations, querying databases, or calling APIs.

### 🎯 Why Tools?
- LLMs can't browse the internet, do math accurately, or access databases
- Tools give LLMs **superpowers** to interact with the real world
- The LLM decides **when** and **which** tool to use

### 💻 Creating Custom Tools

#### Method 1: @tool Decorator (Easiest)
```python
from langchain_core.tools import tool

@tool
def multiply(a: float, b: float) -> float:
    """Multiply two numbers together."""
    return a * b

@tool
def add(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b

@tool
def get_word_count(text: str) -> int:
    """Count the number of words in a text."""
    return len(text.split())

# Tool properties
print(multiply.name)         # "multiply"
print(multiply.description)  # "Multiply two numbers together."
print(multiply.args)         # {'a': {'type': 'number'}, 'b': {'type': 'number'}}

# Direct invocation
result = multiply.invoke({"a": 5, "b": 3})
print(result)  # 15
```

#### Method 2: StructuredTool (More Control)
```python
from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="The search query")
    max_results: int = Field(default=5, description="Max results to return")

def search_function(query: str, max_results: int = 5) -> str:
    return f"Results for '{query}': [result1, result2, ...]"

search_tool = StructuredTool.from_function(
    func=search_function,
    name="web_search",
    description="Search the web for information",
    args_schema=SearchInput
)
```

### 🔧 Built-in Tools
```python
# Wikipedia
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
wiki = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

# DuckDuckGo Search
from langchain_community.tools import DuckDuckGoSearchRun
search = DuckDuckGoSearchRun()

# Python REPL (Run Python code)
from langchain_community.tools import PythonREPLTool
python_repl = PythonREPLTool()

# Tavily Search (AI-optimized search)
from langchain_community.tools.tavily_search import TavilySearchResults
search = TavilySearchResults(max_results=3)
```

### 🤖 Binding Tools to a Model
```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini")

# Bind tools to the model
model_with_tools = model.bind_tools([multiply, add, get_word_count])

# The model decides which tool to call
result = model_with_tools.invoke("What is 15 times 23?")

# Check if a tool was called
print(result.tool_calls)
# [{'name': 'multiply', 'args': {'a': 15, 'b': 23}, 'id': 'call_xyz'}]
```

---

## 17. Agents

### 📖 Definition
**Agents** use an LLM as a **reasoning engine** to dynamically decide:
1. **Which tools** to use
2. **In what order** to use them
3. **When to stop** and give a final answer

Unlike chains (fixed sequence), agents **loop** and make decisions at each step.

### 🔄 Agent vs Chain
| Feature | Chain | Agent |
|---------|-------|-------|
| Execution | Fixed sequence | Dynamic decisions |
| Control Flow | Predetermined | LLM decides |
| Flexibility | Low | High |
| Use Case | Simple workflows | Complex reasoning |

### 🧠 How Agents Work (ReAct Loop)
```
1. THINK:   "I need to find X. Let me use the search tool."
2. ACT:     Calls search_tool("X")
3. OBSERVE: Gets result from the tool
4. THINK:   "Now I have the info. Let me calculate Y."
5. ACT:     Calls calculator_tool(Y)
6. OBSERVE: Gets result
7. THINK:   "I have all the info. Let me give the final answer."
8. ANSWER:  Returns the final response
```

### 💻 Creating an Agent

```python
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Step 1: Define Tools
@tool
def search_web(query: str) -> str:
    """Search the web for current information."""
    return f"Search results for: {query}"

@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression."""
    return str(eval(expression))

tools = [search_web, calculator]

# Step 2: Define Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when needed."),
    MessagesPlaceholder("chat_history", optional=True),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad")  # Required for agent reasoning
])

# Step 3: Create Agent
model = ChatOpenAI(model="gpt-4o-mini")
agent = create_tool_calling_agent(model, tools, prompt)

# Step 4: Create Executor (runs the agent loop)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,       # See the reasoning steps
    max_iterations=5    # Prevent infinite loops
)

# Step 5: Run!
result = agent_executor.invoke({
    "input": "What is the population of India times 2?"
})
print(result["output"])
```

### 🔍 Agent Execution Output (verbose=True)
```
> Entering new AgentExecutor chain...

Thought: I need to search for India's population first.
Action: search_web
Action Input: "current population of India"
Observation: India's population is approximately 1.44 billion.

Thought: Now I need to multiply this by 2.
Action: calculator
Action Input: "1440000000 * 2"
Observation: 2880000000

Thought: I have the answer now.
Final Answer: India's population times 2 is approximately 2.88 billion.

> Finished chain.
```

### 🔧 Agent with Memory
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True
)

# Conversation with memory
agent_executor.invoke({"input": "My name is Sahil"})
agent_executor.invoke({"input": "What is my name?"})  # Remembers!
```

### 📊 Agent Types Summary
| Agent Type | Description | When to Use |
|------------|-------------|-------------|
| `create_tool_calling_agent` | Modern, uses function calling | Default choice |
| `create_react_agent` | ReAct reasoning pattern | When you need explicit reasoning |
| `create_openai_tools_agent` | OpenAI-specific tool calling | OpenAI models only |

---

## 18. Structured Output

### 📖 Definition
**Structured Output** forces the LLM to return data in a **specific schema** (JSON, Pydantic models) rather than free-form text. This is essential for applications that need to programmatically consume LLM outputs.

### 💻 Method 1: .with_structured_output() (Recommended)
```python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

# Define the schema
class MovieReview(BaseModel):
    title: str = Field(description="Name of the movie")
    rating: float = Field(description="Rating out of 10")
    summary: str = Field(description="Brief summary of the review")
    recommended: bool = Field(description="Whether you recommend it")

model = ChatOpenAI(model="gpt-4o-mini")

# Bind the schema to the model
structured_model = model.with_structured_output(MovieReview)

# Now the model ALWAYS returns a MovieReview object
result = structured_model.invoke("Review the movie Inception")
print(result.title)        # "Inception"
print(result.rating)       # 9.2
print(result.summary)      # "A mind-bending thriller..."
print(result.recommended)  # True
print(type(result))        # <class 'MovieReview'>
```

### 💻 Method 2: Using Output Parsers
```python
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate

parser = PydanticOutputParser(pydantic_object=MovieReview)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a movie critic. {format_instructions}"),
    ("human", "Review: {movie}")
]).partial(format_instructions=parser.get_format_instructions())

chain = prompt | model | parser
result = chain.invoke({"movie": "Inception"})
```

---

## 19. LangSmith (Tracing & Debugging)

### 📖 Definition
**LangSmith** is LangChain's platform for **tracing, debugging, monitoring, and evaluating** LLM applications. It gives you full visibility into every step of your chain/agent.

### 🔧 Setup
```python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-langsmith-api-key"
os.environ["LANGCHAIN_PROJECT"] = "my-project"
```

### 🎯 What LangSmith Shows You
| Feature | Description |
|---------|-------------|
| **Traces** | Full execution path of every chain/agent call |
| **Inputs/Outputs** | What went in and came out at each step |
| **Latency** | How long each step took |
| **Token Usage** | How many tokens were consumed |
| **Errors** | Where and why failures occurred |
| **Evaluation** | Test your app against golden datasets |

### 💡 Interview Tip
> "I would use LangSmith to trace agent execution, identify bottlenecks, monitor token usage, and evaluate retrieval quality against a golden dataset."

---

## 20. LangGraph (Advanced Agents)

### 📖 Definition
**LangGraph** is an extension of LangChain for building **complex, stateful, multi-agent systems** using a **graph-based architecture**. It replaces simple agent loops with customizable nodes and edges.

### 🎯 Why LangGraph Over Basic Agents?
| Feature | Basic Agents | LangGraph |
|---------|-------------|-----------|
| Control Flow | Simple loop | Custom graphs |
| State Management | Basic | Rich, typed state |
| Multi-Agent | ❌ | ✅ |
| Human-in-the-loop | ❌ | ✅ |
| Cycles & Branching | Limited | Full control |
| Persistence | ❌ | ✅ Built-in |

### 💻 Basic LangGraph Example
```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

# Define state
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]

# Define nodes (functions)
def chatbot(state: AgentState):
    # Process messages and return response
    response = model.invoke(state["messages"])
    return {"messages": [response]}

def tool_node(state: AgentState):
    # Execute tool calls
    pass

# Build graph
graph = StateGraph(AgentState)
graph.add_node("chatbot", chatbot)
graph.add_node("tools", tool_node)

graph.set_entry_point("chatbot")
graph.add_conditional_edges("chatbot", should_continue)
graph.add_edge("tools", "chatbot")

# Compile and run
app = graph.compile()
result = app.invoke({"messages": [("user", "Hello!")]})
```

### 💡 Interview Tip
> "For simple tool-calling, I'd use a basic agent. For complex workflows with branching, cycles, or multiple agents, I'd use LangGraph."

---

## 21. Interview Questions & Answers

### Q1: What is LangChain and why do we need it?
**Answer:** LangChain is an open-source framework that simplifies building LLM-powered applications. We need it because raw LLMs are stateless, can't access external data, and can't perform actions. LangChain provides modular components (models, prompts, chains, memory, agents, retrievers) that solve these limitations and let us build production-ready AI applications.

### Q2: What is the difference between an LLM and a Chat Model?
**Answer:** An LLM takes a string and returns a string (text → text). A Chat Model takes a sequence of messages (with roles: system, human, ai) and returns a message. Chat models are preferred because they understand conversation roles, follow instructions better, and support multi-turn conversations.

### Q3: What is LCEL and why is it preferred?
**Answer:** LCEL (LangChain Expression Language) is the modern way to compose chains using the pipe operator (`|`). It's preferred over legacy chains because it provides built-in streaming, async, batch processing, parallel execution, and better debugging with LangSmith.

### Q4: Explain the RAG pipeline.
**Answer:**
1. **Load** — Import documents using Document Loaders (PDF, web, CSV)
2. **Split** — Break into chunks using Text Splitters (RecursiveCharacterTextSplitter)
3. **Embed & Store** — Convert to vectors and store in Vector Store (FAISS/Chroma)
4. **Retrieve & Generate** — Find relevant chunks with a Retriever, inject into prompt, LLM generates grounded answer

### Q5: What is the difference between a Chain and an Agent?
**Answer:** A Chain has a **fixed execution sequence** — Step A → Step B → Step C. An Agent uses the LLM as a **reasoning engine** to dynamically decide which tools to call and in what order. Agents can loop, branch, and adapt their behavior based on intermediate results.

### Q6: What is the difference between a Retriever and a Vector Store?
**Answer:** A Vector Store is a **database** that stores embedding vectors and supports similarity search. A Retriever is an **interface** that fetches relevant documents given a query. A Vector Store can be converted into a Retriever using `.as_retriever()`, but retrievers can also come from other sources (databases, APIs, etc.).

### Q7: How do you handle conversations that exceed the LLM's context window?
**Answer:** Several strategies:
- **ConversationBufferWindowMemory** — Keep only last K messages
- **ConversationSummaryMemory** — Summarize older messages
- **ConversationSummaryBufferMemory** — Hybrid approach
- In RAG, use **text splitters** with overlap to handle long documents

### Q8: What is the difference between similarity search and MMR?
**Answer:** Similarity search returns the K most similar documents (may be redundant). MMR (Maximum Marginal Relevance) returns documents that are both similar to the query AND diverse from each other, reducing redundancy.

### Q9: When would you use an Agent vs a simple Chain?
**Answer:** Use a **Chain** when:
- The workflow is predictable and fixed
- You know exactly which steps to execute
- Performance is critical (chains are faster)

Use an **Agent** when:
- The workflow depends on the input
- You need dynamic tool selection
- The problem requires multi-step reasoning
- You don't know in advance which tools are needed

### Q10: What are Output Parsers and when do you use them?
**Answer:** Output Parsers transform raw LLM text into structured formats (JSON, Pydantic objects, lists). Use them when your application needs to programmatically consume LLM output — for example, extracting specific fields, feeding data into APIs, or populating databases.

### Q11: How do you evaluate a RAG system?
**Answer:**
- **Retrieval metrics**: Are we finding the right documents? (Precision, Recall)
- **Generation metrics**: Is the answer correct and grounded? (Faithfulness, Relevancy)
- **Use LangSmith** to trace, log, and compare against golden datasets
- **Test for hallucination**: Does the answer contain info NOT in the retrieved context?

### Q12: What is LangGraph and when would you use it?
**Answer:** LangGraph is a graph-based framework for building complex, stateful agent systems. Use it when:
- You need multi-agent orchestration
- Your workflow has cycles or complex branching
- You need human-in-the-loop approval steps
- You need persistent state across interactions
- Basic AgentExecutor is too limited

---

## 22. Quick Revision Cheat Sheet

### 🔑 Essential Imports
```python
# Models
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# Prompts
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Output Parsers
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

# Document Processing
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Vector Stores
from langchain_community.vectorstores import FAISS, Chroma

# Runnables
from langchain_core.runnables import RunnablePassthrough, RunnableLambda, RunnableParallel

# Tools & Agents
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor

# Memory
from langchain.memory import ConversationBufferMemory
```

### ⚡ Quick Patterns

#### Pattern 1: Simple Chain
```python
chain = prompt | model | parser
result = chain.invoke({"topic": "AI"})
```

#### Pattern 2: RAG Chain
```python
chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | parser
)
```

#### Pattern 3: Agent
```python
agent = create_tool_calling_agent(model, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
result = executor.invoke({"input": "..."})
```

#### Pattern 4: Structured Output
```python
structured_model = model.with_structured_output(MyPydanticModel)
result = structured_model.invoke("...")
```

### 📊 Component Decision Tree
```
Need to process data?     → Document Loaders + Text Splitters
Need external knowledge?  → RAG (Vector Store + Retriever)
Need conversation memory? → Memory (Buffer/Window/Summary)
Need real-world actions?  → Tools + Agents
Need structured data?     → Output Parsers / .with_structured_output()
Need complex workflows?   → LangGraph
Need to debug/monitor?    → LangSmith
```

---

## 🎯 FINAL TIPS FOR YOUR INTERVIEW

1. **Know the "Why"** — Don't just know WHAT LangChain components do, know WHY they exist
2. **Think in Pipelines** — Everything in LangChain flows: Input → Process → Output
3. **LCEL is King** — Modern LangChain uses LCEL. Know the pipe operator (`|`)
4. **RAG is the #1 Use Case** — Most interview questions will touch on RAG
5. **Agents vs Chains** — Know when to use which
6. **Production Thinking** — Mention LangSmith, error handling, cost optimization
7. **Code Examples** — Be ready to write chains, RAG pipelines, and agents from scratch

---

> 📝 **Notes Created:** September 10, 2026
> 📚 **Source:** CampusX — "Generative AI using LangChain" YouTube Playlist
> 🎯 **Purpose:** Interview Preparation — Complete Reference Guide
> ✅ **Coverage:** All 6 core components + Advanced Topics + Code + Interview Q&A

---

**Best of luck with your interview, Sahil! 🚀**
