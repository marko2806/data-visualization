import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

initial_data = pd.read_csv("./lab2/data.csv")
initial_data = pd.pivot_table(initial_data, "Value", index="Country", columns="Indicator")

imputer = IterativeImputer()
data = pd.DataFrame(imputer.fit_transform(initial_data.to_numpy()), \
    columns=list(initial_data.columns), index=list(initial_data.index))



data_scaled = StandardScaler().fit(data).transform(data)

data.to_csv("pivoted_data.csv", index=True, index_label="Country")

new_data = PCA(n_components=2).fit_transform(data_scaled)
new_data = pd.DataFrame(data= new_data, columns=["X", "Y"], index=initial_data.index.tolist())

new_data.to_csv("./lab2/pca_data.csv", index=True, index_label="Country")
