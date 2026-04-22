from langgraph.graph import StateGraph, START, END

from pipelines.state import PipelineState

from agents.ingestion_agent import IngestionAgent
from agents.cleaning_agent import CleaningAgent
from agents.eda_agent import EDAAgent
from agents.prediction_agent import PredictionAgent
from agents.reporting_agent import ReportingAgent

# 1. Initialize our agents
ingestion_agent = IngestionAgent()
cleaning_agent = CleaningAgent()
eda_agent = EDAAgent()
prediction_agent = PredictionAgent()
reporting_agent = ReportingAgent()

# 2. Define node wrappers that LangGraph can call natively
def run_ingestion(state: PipelineState):
    return ingestion_agent.run(state)

def run_cleaning(state: PipelineState):
    return cleaning_agent.run(state)

def run_eda(state: PipelineState):
    return eda_agent.run(state)

def run_prediction(state: PipelineState):
    return prediction_agent.run(state)

def run_reporting(state: PipelineState):
    return reporting_agent.run(state)

# 3. Construct the shared StateGraph
workflow = StateGraph(PipelineState)

# Add Nodes
workflow.add_node("ingestion", run_ingestion)
workflow.add_node("cleaning", run_cleaning)
workflow.add_node("eda", run_eda)
workflow.add_node("prediction", run_prediction)
workflow.add_node("reporting", run_reporting)

# 4. Define Graph Routing / Control Flow
workflow.add_edge(START, "ingestion")
workflow.add_edge("ingestion", "cleaning")
workflow.add_edge("cleaning", "eda")
workflow.add_edge("eda", "prediction")
workflow.add_edge("prediction", "reporting")
workflow.add_edge("reporting", END)

# 5. Compile into an executable application
app = workflow.compile()
