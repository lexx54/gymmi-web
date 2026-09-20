import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { qKey: 'landing.faq.q1', aKey: 'landing.faq.a1' },
    { qKey: 'landing.faq.q2', aKey: 'landing.faq.a2' },
    { qKey: 'landing.faq.q3', aKey: 'landing.faq.a3' },
    { qKey: 'landing.faq.q4', aKey: 'landing.faq.a4' },
    { qKey: 'landing.faq.q5', aKey: 'landing.faq.a5' },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <SectionWrapper id="faq">
      <SectionInner>
        <HeaderGroup>
          <SectionBadge>
            <Sparkles size={14} color="#ef233c" />
            <span>{t('landing.faq.tag')}</span>
          </SectionBadge>
          <SectionTitle>{t('landing.faq.title')}</SectionTitle>
        </HeaderGroup>

        <AccordionList>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <AccordionItem key={idx} $open={isOpen}>
                <AccordionHeader
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <HeaderTitleGroup>
                    <HelpCircle size={18} color={isOpen ? '#ef233c' : '#64748b'} />
                    <QuestionText>{t(faq.qKey)}</QuestionText>
                  </HeaderTitleGroup>
                  <ChevronWrapper $open={isOpen}>
                    <ChevronDown size={18} />
                  </ChevronWrapper>
                </AccordionHeader>

                {isOpen && (
                  <AccordionBody>
                    <AnswerText>{t(faq.aKey)}</AnswerText>
                  </AccordionBody>
                )}
              </AccordionItem>
            );
          })}
        </AccordionList>
      </SectionInner>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  padding: 6rem 1.5rem;
  background: #0b1120;
`;

const SectionInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const HeaderGroup = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3.5rem;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.3);
  border-radius: 9999px;
  color: #fca5a5;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccordionItem = styled.div<{ $open: boolean }>`
  background: ${({ $open }) =>
    $open ? 'rgba(30, 41, 59, 0.75)' : 'rgba(30, 41, 59, 0.4)'};
  border: 1px solid
    ${({ $open }) => ($open ? 'rgba(239, 35, 60, 0.3)' : 'rgba(255, 255, 255, 0.08)')};
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.2s ease;
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const QuestionText = styled.span`
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
`;

const ChevronWrapper = styled.div<{ $open: boolean }>`
  color: #94a3b8;
  display: flex;
  align-items: center;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.25s ease;
`;

const AccordionBody = styled.div`
  padding: 0 1.5rem 1.5rem 3.25rem;
`;

const AnswerText = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.7;
`;
