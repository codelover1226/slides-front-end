import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { Collapse } from "react-bootstrap";
import { axiosAdmin } from "services/api";
import { GET_ALL_FAQ_URL } from "helper/url_helper";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import Breadcrumb from "modules/slider/components/Breadcrumb";
const Faq = () => {
  const [isOpen, setIsOpen] = useState([]);
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axiosAdmin
      .post(GET_ALL_FAQ_URL, {
        site_id: 6,
      })
      .then(res => {
        if (res.status && res.data?.data?.rows) {
          setLoading(false);
          setFaq(res.data.data.rows);
        }
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message || err.message);
      });
  }, []);
  const openClose = id => {
    if (isOpen.includes(id)) {
      setIsOpen(pre => pre.filter(x => x !== id));
    } else {
      setIsOpen(pre => [...pre, id]);
    }
  };
  return (
    <div className="right_bar">
      <Breadcrumb />
      <h1 className="hello_title">Frequently asked Questions</h1>
      <div className="right-main-card main-card">
        <div className="container-fluid">
          <div className="sub-container">
            <Card>
              <CardBody>
                {!!faq.length > 0 ? (
                  <>
                    {faq.map(FAQ => (
                      <div
                        key={FAQ.faq_id}
                        className="faq"
                        style={{ display: "block" }}
                      >
                        <div
                          className="faq-title cursor-pointer "
                          style={{ maxWidth: "100%" }}
                          onClick={() => openClose(FAQ.faq_id)}
                        >
                          <h5>{FAQ.title}</h5>
                          <i
                            className={`bx bx-chevron-${
                              isOpen.includes(FAQ.faq_id) ? "up" : "down"
                            }`}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <Collapse
                          in={isOpen.includes(FAQ.faq_id)}
                          className="faq-collapse"
                        >
                          <div>
                            <div className="faq-text">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(FAQ.content),
                                }}
                              />
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {loading ? (
                      <div>Please wait while data is loading</div>
                    ) : (
                      <div>No FAQs available</div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
