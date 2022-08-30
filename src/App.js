import { useState } from "react";
import "./App.css";
import ASN1 from "@lapo/asn1js";
import Hex from "@lapo/asn1js/hex";

const App = () => {
  const names = [
    { id: 1, name: "іванов іван іванович" },
    { id: 2, name: "олеговський олег олегович" },
    { id: 3, name: "костянтинів костянтин костянтинович" },
  ];
  const [isInputOpen, setInputOpen] = useState(false);
  const areaChanger = () => {
    setInputOpen(!isInputOpen);
  };

  const [drag, setDrag] = useState(false);
  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };
  const dropHandler = (e) => {
    e.preventDefault();
    let files = [...e.dataTransfer.files];
    decoder(files[0]);
  };

  const decoder = (e, stream, size) => {
    const Human = ASN1.decode("Human", function () {
      this.seq().obj(
        this.key("commonName").octstr(),
        this.key("organizationName").octstr(),
        this.key("serialNumber").octstr(),
        this.key("countryName").octstr()
      );
    });
    console.log(Human);
    var output = Human.stream.pos(e, "der");

    console.log(output, 'olegovisch');

    const result = Human.decode(e, "per");
    console.log(result, "result");

    if (result.typeName() !== "SEQUENCE") {
      throw "Неправильна структура конверта сертифіката (очікується SEQUENCE)";
    }
    const tbsCertificate = result.sub[0];
    console.log(tbsCertificate, "серт");
  };

  return (
    <div className="App">
      <div className="namesWrapper">
        <div className="names">
          {names.map((n) => (
            <div className="name">{n.name}</div>
          ))}
        </div>
        <button onClick={() => areaChanger()}>
          {isInputOpen ? "Скасувати" : "Додати"}
        </button>
      </div>
      <div className="content">
        {isInputOpen ? (
          <div className="drag_area">
            {drag ? (
              <div
                className="drag"
                onDragStart={(e) => dragStartHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => dragStartHandler(e)}
                onDrop={(e) => dropHandler(e)}
              >
                Відпустіть для завантаження
              </div>
            ) : (
              <div
                className="no_drag"
                onDragStart={(e) => dragStartHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => dragStartHandler(e)}
              >
                Перетягніть для завантаження
              </div>
            )}
          </div>
        ) : (
          <div>ОЦЕ ТУТ ІНФО</div>
        )}
      </div>
    </div>
  );
};

export default App;
